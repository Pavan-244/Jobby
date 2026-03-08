import './index.css'

const ProfileCard = ({profile}) => {
  const {name, profileImageUrl, shortBio} = profile
  return (
    <div
      className="profile-card"
      style={{
        backgroundImage:
          'url(https://assets.ccbp.in/frontend/react-js/profile-bg.png)',
      }}
    >
      <img src={profileImageUrl} alt="profile" className="profile-img" />
      <h1 className="profile-name">{name}</h1>
      <p className="profile-bio">{shortBio}</p>
    </div>
  )
}

export default ProfileCard
