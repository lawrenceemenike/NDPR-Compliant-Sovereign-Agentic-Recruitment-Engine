import os
import json
import logging
from typing import Dict, Any, List
from pydantic import BaseModel, Field
import httpx
from backend.agents.parser import ParsedResumeMetadata

logger = logging.getLogger("aegisrecruit.evaluator")

class EvaluationResult(BaseModel):
    candidate_id: str
    technical_score: float
    governance_score: float
    composite_score: float
    recommendation: str  # "Advance to Board Interview" | "Hold for Specialist Review" | "Reject"
    matched_subsidiary: str
    executive_summary: str
    board_questions: List[str]
    agent_logs: Dict[str, Any]

class TechnicalScreenerAgent:
    """
    Agent 1: Technical Screener
    Scores technical capability against BNH core stack and architectural rigor.
    """
    REQUIRED_CORE = ["Python", "FastAPI", "Next.js", "TypeScript", "PostgreSQL", "Docker", "Cloud", "AWS"]

    def evaluate(self, sanitized_text: str, metadata: ParsedResumeMetadata) -> Dict[str, Any]:
        text_lower = sanitized_text.lower()
        score = 50.0  # Base
        strengths = []
        gaps = []

        # 1. Core Stack match
        stack_found = [s for s in metadata.core_tech_stack if s]
        bnh_matches = []
        for req in ["python", "fastapi", "next.js", "react", "typescript", "postgres", "docker", "aws", "gcp", "azure"]:
            if req in text_lower or any(req in s.lower() for s in stack_found):
                bnh_matches.append(req.title())

        match_count = len(set(bnh_matches))
        score += min(match_count * 5.0, 25.0)
        strengths.append(f"Demonstrated proficiency in {match_count} BNH core architectural assets ({', '.join(set(bnh_matches))})")

        # 2. Cloud and Infrastructure
        if any(c in text_lower for c in ["kubernetes", "docker", "terraform", "ci/cd", "github actions", "aws", "helm"]):
            score += 10.0
            strengths.append("Verified modern infrastructure and cloud deployment track record")
        else:
            gaps.append("Limited explicit production container orchestration / cloud IaC evidence")

        # 3. Experience & Seniority multiplier
        if metadata.years_of_experience >= 7:
            score += 10.0
            strengths.append(f"Substantial seasoned tenure ({metadata.years_of_experience:.1f} yrs)")
        elif metadata.years_of_experience >= 4:
            score += 5.0
        elif metadata.years_of_experience < 2:
            score -= 10.0
            gaps.append("Junior tenure requires senior architectural supervision")

        score = min(max(round(score, 1), 20.0), 98.0)

        rationale = (
            f"Technical Screener evaluated candidate against Brendan Nicholas Holdings technology mandates. "
            f"Candidate achieved {score}/100 based on verified competence in {', '.join(stack_found[:5])}."
        )

        return {
            "agent_name": "Technical Screener Agent",
            "score": score,
            "strengths": strengths,
            "gaps": gaps,
            "rationale": rationale,
            "verified_stack": stack_found
        }

class InstitutionalFitAgent:
    """
    Agent 2: Institutional Fit & Governance Assessor
    Evaluates documentation discipline (READMEs, runbooks), operational autonomy, and compliance mindset.
    """
    def evaluate(self, sanitized_text: str, metadata: ParsedResumeMetadata) -> Dict[str, Any]:
        text_lower = sanitized_text.lower()
        score = 45.0
        strengths = []
        risks = []

        # 1. Documentation discipline (README, runbooks, architecture docs, specs)
        doc_indicators = ["readme", "runbook", "documentation", "rfc", "adr", "post-mortem", "specification", "sop", "guidelines"]
        doc_hits = [w for w in doc_indicators if w in text_lower]
        if doc_hits:
            score += min(len(doc_hits) * 8.0, 24.0)
            strengths.append(f"Exhibits exceptional documentation culture ({', '.join(doc_hits)})")
        else:
            score -= 5.0
            risks.append("No explicit reference to runbooks, ADRs, or systemic documentation practices")

        # 2. Autonomy, Leadership, Ownership
        autonomy_words = ["mentored", "architected", "spearheaded", "led", "autonomous", "ownership", "founded", "scaled", "stakeholder"]
        auto_hits = [w for w in autonomy_words if w in text_lower]
        if len(auto_hits) >= 3:
            score += 15.0
            strengths.append(f"Strong executive autonomy and initiative footprint ({', '.join(auto_hits[:4])})")
        elif len(auto_hits) >= 1:
            score += 8.0
        else:
            risks.append("Requires close task specification; lower indicator of autonomous initiative")

        # 3. Regulatory / Enterprise Security awareness
        sec_words = ["compliance", "security", "audit", "governance", "gdpr", "ndpr", "iso", "soc2", "encryption", "rbac"]
        sec_hits = [w for w in sec_words if w in text_lower]
        if sec_hits:
            score += 12.0
            strengths.append(f"Demonstrated regulatory/governance operational sensitivity ({', '.join(sec_hits)})")
        else:
            score += 3.0

        score = min(max(round(score, 1), 25.0), 96.0)

        rationale = (
            f"Institutional Fit Assessor evaluated governance maturity and autonomy indicators. "
            f"Score reflects institutional alignment for Brendan Nicholas Holdings high-trust executive culture."
        )

        return {
            "agent_name": "Institutional Fit Assessor Agent",
            "score": score,
            "strengths": strengths,
            "risks": risks,
            "rationale": rationale
        }

class SynthesizerAgent:
    """
    Synthesizer: Aggregates multi-agent deliberations, calculates composite score,
    and produces the definitive Executive Briefing Card.
    """
    def synthesize(
        self,
        candidate_id: str,
        tech_eval: Dict[str, Any],
        fit_eval: Dict[str, Any],
        metadata: ParsedResumeMetadata
    ) -> EvaluationResult:
        tech_score = tech_eval["score"]
        fit_score = fit_eval["score"]

        # Weighted calculation: 55% Tech, 45% Institutional Fit
        composite = round((tech_score * 0.55) + (fit_score * 0.45), 1)

        # Decision Threshold
        if composite >= 78.0 and not fit_eval["risks"]:
            recommendation = "Advance to Board Interview"
        elif composite >= 68.0:
            recommendation = "Hold for Specialist Review"
        else:
            recommendation = "Reject"

        # Tailored Board Questions for Brendan Nicholas Holdings interviewers
        board_questions = [
            f"How have you structured operational runbooks and automated disaster recovery within your {metadata.matched_subsidiary_fit} projects?",
            f"Brendan Nicholas Holdings mandates strict NDPR data privacy; describe an incident where you enforced PII boundary separation across service edges.",
            f"Given your experience with {', '.join(metadata.core_tech_stack[:3])}, how do you evaluate technical debt vs speed-to-market when delivering for high-impact subsidiaries?"
        ]

        # Executive Summary Markdown
        exec_summary = (
            f"### Executive Briefing: {metadata.candidate_name}\n\n"
            f"**Subsidiary Alignment:** BNH {metadata.matched_subsidiary_fit} Division  \n"
            f"**Composite Score:** {composite}/100 — **Recommendation:** {recommendation}\n\n"
            f"#### Strategic Appraisal\n"
            f"- **Technical Capability ({tech_score}/100):** {tech_eval['rationale']}\n"
            f"- **Institutional Governance ({fit_score}/100):** {fit_eval['rationale']}\n"
            f"- **Key Assets:** {'; '.join(tech_eval['strengths'][:2])}. {'; '.join(fit_eval['strengths'][:2])}.\n"
        )

        if fit_eval["risks"] or tech_eval["gaps"]:
            exec_summary += f"\n#### Areas of Inquisitorial Focus\n"
            for g in tech_eval["gaps"] + fit_eval["risks"]:
                exec_summary += f"- {g}\n"

        agent_logs = {
            "technical_screener": tech_eval,
            "institutional_fit": fit_eval,
            "synthesizer_decision": {
                "composite_score": composite,
                "recommendation": recommendation,
                "decision_rule": "Composite >= 78.0 -> Advance to Board Interview; >= 68.0 -> Hold; < 68.0 -> Reject",
                "evaluated_at_utc": "Automated Multi-Agent Consensus"
            }
        }

        return EvaluationResult(
            candidate_id=candidate_id,
            technical_score=tech_score,
            governance_score=fit_score,
            composite_score=composite,
            recommendation=recommendation,
            matched_subsidiary=metadata.matched_subsidiary_fit,
            executive_summary=exec_summary,
            board_questions=board_questions,
            agent_logs=agent_logs
        )

class MultiAgentEvaluator:
    def __init__(self):
        self.tech_screener = TechnicalScreenerAgent()
        self.institutional_fit = InstitutionalFitAgent()
        self.synthesizer = SynthesizerAgent()

    async def evaluate_candidate(
        self,
        candidate_id: str,
        sanitized_text: str,
        metadata: ParsedResumeMetadata
    ) -> EvaluationResult:
        tech_eval = self.tech_screener.evaluate(sanitized_text, metadata)
        fit_eval = self.institutional_fit.evaluate(sanitized_text, metadata)
        return self.synthesizer.synthesize(candidate_id, tech_eval, fit_eval, metadata)

# Global evaluator singleton
evaluator = MultiAgentEvaluator()
