import re
import hashlib
from typing import Dict, List, Tuple, Any
from dataclasses import dataclass, field
from datetime import datetime, timezone

@dataclass
class RedactionResult:
    sanitized_text: str
    original_char_count: int
    sanitized_char_count: int
    pii_counts: Dict[str, int]
    redacted_items: List[Dict[str, str]]
    prompt_injection_detected: bool
    injection_warnings: List[str]
    compliance_token: str
    execution_duration_ms: float

class NDPRShield:
    """
    NDPR (Nigeria Data Protection Regulation) Security & Governance Gateway
    Enforces pre-context edge masking and adversarial prompt injection filtering.
    """

    # Nigerian Phone regex (Supports +234, 234, 080, 081, 070, 090, 091 formats with separators)
    PHONE_REGEX = re.compile(
        r"(?:(?:\+?234|0)[\s\-]*(?:[789][01]\d|80\d|81\d|70\d|90\d|91\d)[\s\-]*\d{3}[\s\-]*\d{4}|\b0[789][01]\d{8}\b)",
        re.IGNORECASE
    )

    # Email pattern
    EMAIL_REGEX = re.compile(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b",
        re.IGNORECASE
    )

    # Nigerian National Identity (NIN) / Bank Verification Number (BVN): 11 consecutive digits
    # Matches explicit "NIN:", "BVN:" prefixes or standalone 11-digit blocks
    NIN_BVN_REGEX = re.compile(
        r"(?:(?:NIN|BVN|National\s+ID|Identity\s+No|Bank\s+Verification)[\s\:\#\-]*(\d{11}))|(?:\b\d{11}\b)",
        re.IGNORECASE
    )

    # Municipal Address & Physical Location Patterns in Nigeria
    ADDRESS_REGEX = re.compile(
        r"(?i)\b(?:\d+[\w\s,]+(?:Street|St|Close|Cl|Crescent|Cres|Avenue|Ave|Road|Rd|Drive|Dr|Way|Boulevard|Blvd|Estate|Phase\s*\d+|Block\s*[A-Z0-9]+|Plot\s*\d+))[\w\s,]+(?:Lagos|Abuja|Ikeja|Lekki|Victoria\s*Island|Ikoyi|Yaba|Surulere|Garki|Maitama|Wuse|Port\s*Harcourt|Ibadan|Enugu|Asaba|Kano|Kaduna|Rivers|Oyo|Ogun)\b",
        re.IGNORECASE
    )

    # Specific common standalone Nigerian urban residential landmarks
    LANDMARK_REGEX = re.compile(
        r"(?i)\b(?:Victoria Island|V\.I\.|Lekki Phase [12]|Ikoyi|Ikeja GRA|Garki [12]|Maitama District|Wuse [12]|Asokoro|Banana Island|Magodo Phase [12]|Surulere|Yaba)\b",
        re.IGNORECASE
    )

    # Adversarial Prompt Injection Signatures
    INJECTION_PATTERNS = [
        r"ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions",
        r"disregard\s+(?:all\s+)?(?:previous|system|prompt)\s+(?:rules|commands|instructions)",
        r"system\s*prompt\s*override",
        r"you\s+are\s+now\s+(?:dan|unrestricted|god\s*mode|root|jailbreak)",
        r"(?:reveal|display|output|show)\s+(?:your\s+)?(?:system\s+prompt|instructions|initial\s+prompt)",
        r"(?:bypass|disable)\s+(?:ndpr|compliance|security|filtering|guard)",
        r"(?:give|score|rate)\s+(?:this\s+candidate|me)\s+(?:100|max|perfect|10/10)",
        r"do\s+not\s+(?:evaluate|screen|audit)",
        r"<\|(?:im_start|im_end|endoftext)\|>",
        r"\[SYSTEM_OVERRIDE\]"
    ]

    def __init__(self):
        self._compiled_injection = [re.compile(p, re.IGNORECASE) for p in self.INJECTION_PATTERNS]

    def _hash_val(self, text: str) -> str:
        return hashlib.sha256(text.strip().encode()).hexdigest()[:8].upper()

    def sanitize_resume(self, text: str, reference_hint: str = "") -> RedactionResult:
        """
        Executes strict PII redaction and security scanning on raw resume text.
        """
        start_time = datetime.now(timezone.utc)
        original_length = len(text)
        sanitized = text
        redacted_items: List[Dict[str, str]] = []
        pii_counts = {
            "emails": 0,
            "phones": 0,
            "nin_bvn": 0,
            "addresses": 0,
            "names": 0,
            "injections_quarantined": 0
        }
        injection_warnings: List[str] = []

        # 1. Prompt Injection Scanning & Quarantine
        injection_detected = False
        for p in self._compiled_injection:
            matches = p.findall(sanitized)
            if matches:
                injection_detected = True
                pii_counts["injections_quarantined"] += len(matches)
                for m in matches:
                    warning_msg = f"Quarantined adversarial injection sequence: '{m}'"
                    injection_warnings.append(warning_msg)
                # Strip and quarantine the malicious override text
                sanitized = p.sub("[SECURITY_ALERT_MALICIOUS_OVERRIDE_QUARANTINED]", sanitized)

        # 2. Email Redaction
        def email_repl(match):
            nonlocal pii_counts
            pii_counts["emails"] += 1
            raw_email = match.group(0)
            token = f"[EMAIL_ANON_{self._hash_val(raw_email)}]"
            redacted_items.append({"category": "EMAIL", "token": token, "type": "PII_CONTACT"})
            return token

        sanitized = self.EMAIL_REGEX.sub(email_repl, sanitized)

        # 3. Nigerian Phone Redaction
        def phone_repl(match):
            nonlocal pii_counts
            pii_counts["phones"] += 1
            raw_phone = match.group(0)
            token = f"[PHONE_ANON_{self._hash_val(raw_phone)}]"
            redacted_items.append({"category": "PHONE_NG", "token": token, "type": "PII_CONTACT"})
            return token

        sanitized = self.PHONE_REGEX.sub(phone_repl, sanitized)

        # 4. NIN / BVN (National Identification / Bank Verification Numbers)
        def nin_bvn_repl(match):
            nonlocal pii_counts
            pii_counts["nin_bvn"] += 1
            raw_id = match.group(1) if match.group(1) else match.group(0)
            token = f"[NIN_BVN_ANON_{self._hash_val(raw_id)}]"
            redacted_items.append({"category": "NIN_BVN", "token": token, "type": "PII_STATUTORY_ID"})
            return token

        sanitized = self.NIN_BVN_REGEX.sub(nin_bvn_repl, sanitized)

        # 5. Physical Addresses
        def address_repl(match):
            nonlocal pii_counts
            pii_counts["addresses"] += 1
            raw_addr = match.group(0)
            token = f"[RESIDENTIAL_ADDRESS_ANON_{self._hash_val(raw_addr)}]"
            redacted_items.append({"category": "ADDRESS", "token": token, "type": "PII_LOCATION"})
            return token

        sanitized = self.ADDRESS_REGEX.sub(address_repl, sanitized)

        # 6. Specific Residential Landmarks
        def landmark_repl(match):
            nonlocal pii_counts
            pii_counts["addresses"] += 1
            raw_land = match.group(0)
            token = "[LOCATION_ANON_NIGERIA_METRO]"
            redacted_items.append({"category": "LANDMARK", "token": token, "type": "PII_LOCATION"})
            return token

        sanitized = self.LANDMARK_REGEX.sub(landmark_repl, sanitized)

        # 7. Candidate Name Header Anonymization
        # Detect common resume headers: e.g., "Full Name: John Doe" or first line name blocks
        candidate_token = f"[CANDIDATE_ANON_{reference_hint or self._hash_val(sanitized[:100])}]"
        name_patterns = [
            r"(?i)\b(?:Name|Full\s*Name|Candidate\s*Name)\s*:\s*([A-Za-z\s\.\-]+)",
            r"(?i)\b(?:Curriculum\s*Vitae|Resume)\s*of\s*([A-Za-z\s\.\-]+)"
        ]
        for np in name_patterns:
            def name_repl(match):
                nonlocal pii_counts
                pii_counts["names"] += 1
                redacted_items.append({"category": "NAME", "token": candidate_token, "type": "PII_IDENTITY"})
                return f"Candidate Identifier: {candidate_token}"
            sanitized = re.sub(np, name_repl, sanitized)

        end_time = datetime.now(timezone.utc)
        duration_ms = (end_time - start_time).total_seconds() * 1000.0

        # Create verifiable audit hash token
        compliance_token = f"NDPR-SEC-{hashlib.sha256((sanitized + str(duration_ms)).encode()).hexdigest()[:12].upper()}"

        return RedactionResult(
            sanitized_text=sanitized,
            original_char_count=original_length,
            sanitized_char_count=len(sanitized),
            pii_counts=pii_counts,
            redacted_items=redacted_items,
            prompt_injection_detected=injection_detected,
            injection_warnings=injection_warnings,
            compliance_token=compliance_token,
            execution_duration_ms=round(duration_ms, 2)
        )

# Global singleton shield
shield = NDPRShield()
