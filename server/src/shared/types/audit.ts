export interface AuditLog {
  entityId?: number;
  tableName: string;
  type: string;
  userId?: string;
  userEmail?: string;
  changes: Record<string, any>;
  comment?: string;
}
