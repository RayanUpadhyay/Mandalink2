import './BadgeIcon.css'

export default function BadgeIcon({ icon, name, description }) {
  return (
    <span className="badge-hover-wrap">
      {icon}
      <span className="badge-tooltip">
        <strong>{name}</strong>
        {description && <div className="badge-tooltip-desc">{description}</div>}
      </span>
    </span>
  )
}
