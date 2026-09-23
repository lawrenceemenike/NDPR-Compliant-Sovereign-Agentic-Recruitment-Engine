"""initial_schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-23 20:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'candidates',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('external_ref_id', sa.String(length=64), nullable=False),
        sa.Column('compliance_status', sa.String(length=32), nullable=False),
        sa.Column('parsed_metadata', sa.JSON(), nullable=False),
        sa.Column('raw_document_type', sa.String(length=16), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_candidates_external_ref_id'), 'candidates', ['external_ref_id'], unique=True)

    op.create_table(
        'evaluations',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('candidate_id', sa.String(length=36), nullable=False),
        sa.Column('technical_score', sa.Float(), nullable=False),
        sa.Column('governance_score', sa.Float(), nullable=False),
        sa.Column('composite_score', sa.Float(), nullable=False),
        sa.Column('recommendation', sa.String(length=64), nullable=False),
        sa.Column('executive_summary', sa.Text(), nullable=False),
        sa.Column('matched_subsidiary', sa.String(length=64), nullable=False),
        sa.Column('agent_logs', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['candidate_id'], ['candidates.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_evaluations_candidate_id'), 'evaluations', ['candidate_id'], unique=False)

    op.create_table(
        'audit_logs',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('event_type', sa.String(length=64), nullable=False),
        sa.Column('details', sa.JSON(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_audit_logs_event_type'), 'audit_logs', ['event_type'], unique=False)
    op.create_index(op.f('ix_audit_logs_timestamp'), 'audit_logs', ['timestamp'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_audit_logs_timestamp'), table_name='audit_logs')
    op.drop_index(op.f('ix_audit_logs_event_type'), table_name='audit_logs')
    op.drop_table('audit_logs')
    op.drop_index(op.f('ix_evaluations_candidate_id'), table_name='evaluations')
    op.drop_table('evaluations')
    op.drop_index(op.f('ix_candidates_external_ref_id'), table_name='candidates')
    op.drop_table('candidates')
