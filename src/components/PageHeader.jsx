// Simple page title block used by the standalone section pages
export default function PageHeader({ tag, title, intro }) {
  return (
    <section className="sec sec-off page-header">
      <div className="inner" style={{ textAlign: 'center', maxWidth: '820px' }}>
        <span className="tag">{tag}</span>
        <h1 className="h2" style={{ fontSize: 'clamp(42px, 6vw, 76px)' }}>{title}</h1>
        {intro && <p className="body-p" style={{ margin: '0 auto' }}>{intro}</p>}
      </div>
    </section>
  );
}
