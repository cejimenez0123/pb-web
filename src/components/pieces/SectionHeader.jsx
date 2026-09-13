export function SectionHeader({
  title,
  note,
  action,
}){
  return (
    <div className="rule mb-5 flex items-end justify-between gap-4 pt-5">
      <div className="min-w-0">
        <h2 className="text-xl leading-tight sm:text-[1.375rem]">{title}</h2>
        {note ? <p className="mt-1 text-sm text-muted-foreground">{note}</p> : null}
      </div>
      {action ? <div className="shrink-0 text-sm">{action}</div> : null}
    </div>
  );
}

export default SectionHeader