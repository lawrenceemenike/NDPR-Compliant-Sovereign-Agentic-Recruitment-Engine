from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.database.connection import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    external_ref_id = Column(String(64), unique=True, index=True, nullable=False)
    compliance_status = Column(String(32), default="NDPR_VERIFIED", nullable=False)
    parsed_metadata = Column(JSON, nullable=False, default=dict)
    raw_document_type = Column(String(16), default="PDF")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    evaluations = relationship("Evaluation", back_populates="candidate", cascade="all, delete-orphan")

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    candidate_id = Column(String(36), ForeignKey("candidates.id"), nullable=False, index=True)
    technical_score = Column(Float, nullable=False)
    governance_score = Column(Float, nullable=False)
    composite_score = Column(Float, nullable=False)
    recommendation = Column(String(64), nullable=False)  # "Advance to Board Interview" | "Hold for Specialist Review" | "Reject"
    executive_summary = Column(Text, nullable=False)
    matched_subsidiary = Column(String(64), nullable=False, default="HoldCo")
    agent_logs = Column(JSON, nullable=False, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    candidate = relationship("Candidate", back_populates="evaluations")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    event_type = Column(String(64), nullable=False, index=True)  # PII_REDACTION, PROMPT_INJECTION_QUARANTINE, RESUME_INGESTION, AGENT_EVALUATION
    details = Column(JSON, nullable=False, default=dict)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
