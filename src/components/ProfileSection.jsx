import './ProfileSection.css';

function ProfileSection({ data }) {
  return (
    <section className="profile-section">
      <div className="profile-container">
        <div className="profile-image-wrapper">
          <img 
            src={data.image} 
            alt={data.name} 
            className="profile-image"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%2300ff41" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23000" font-size="80" font-family="monospace">?</text></svg>';
            }}
          />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{data.name}</h1>
          <p className="profile-tagline">{data.tagline}</p>
          <p className="profile-bio">{data.bio}</p>
          <div className="profile-contact">
            {data.contact.email && (
              <a href={`mailto:${data.contact.email}`} className="contact-link">
                📧 Email
              </a>
            )}
            {data.contact.linkedin && (
              <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
                💼 LinkedIn
              </a>
            )}
            {data.contact.github && (
              <a href={data.contact.github} target="_blank" rel="noopener noreferrer" className="contact-link">
                🐙 GitHub
              </a>
            )}
            {data.contact.website && (
              <a href={data.contact.website} target="_blank" rel="noopener noreferrer" className="contact-link">
                🌐 Website
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileSection;
