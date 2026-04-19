-- Audit log trigger function
create or replace function public.audit_log_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into audit_log (
    table_name,
    record_id,
    action,
    changed_by,
    old_data,
    new_data
  )
  values (
    TG_TABLE_NAME,
    coalesce(NEW.id, OLD.id),
    TG_OP,
    auth.uid(),
    case when TG_OP = 'DELETE' then to_jsonb(OLD) else null end,
    case when TG_OP != 'DELETE' then to_jsonb(NEW) else null end
  );
  return coalesce(NEW, OLD);
end;
$$;

-- Attach trigger to audited tables
create trigger owners_audit
  after insert or update or delete on owners
  for each row execute function audit_log_trigger();

create trigger dogs_audit
  after insert or update or delete on dogs
  for each row execute function audit_log_trigger();

create trigger stays_audit
  after insert or update or delete on stays
  for each row execute function audit_log_trigger();

create trigger stay_notes_audit
  after insert or update or delete on stay_notes
  for each row execute function audit_log_trigger();

create trigger dog_tags_audit
  after insert or update or delete on dog_tags
  for each row execute function audit_log_trigger();

create trigger dog_photos_audit
  after insert or update or delete on dog_photos
  for each row execute function audit_log_trigger();
