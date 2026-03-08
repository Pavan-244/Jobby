import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobCard = props => {
  const {job} = props
  const {
    title,
    rating,
    location,
    jobDescription,
    companyLogoUrl,
    employmentType,
  } = job

  return (
    <li className="similar-job-card">
      <div className="job-header">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div className="title-rating">
          <h1 className="job-title">{title}</h1>
          <div className="rating">
            <AiFillStar className="star-icon" />
            <p>{rating}</p>
          </div>
        </div>
      </div>

      <h1 className="desc-title">Description</h1>
      <p className="desc">{jobDescription}</p>

      <div className="job-meta">
        <div className="meta-item">
          <MdLocationOn className="meta-icon" />
          <p>{location}</p>
        </div>
        <div className="meta-item">
          <BsBriefcaseFill className="meta-icon" />
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobCard
