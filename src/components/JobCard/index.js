import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobCard = props => {
  const {job} = props
  const {
    id,
    title,
    rating,
    location,
    packagePerAnnum,
    jobDescription,
    companyLogoUrl,
    employmentType,
  } = job

  return (
    <Link to={`/jobs/${id}`} className="job-link">
      <li className="job-card">
        <div className="job-header">
          <img
            src={companyLogoUrl}
            alt="company logo"
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

        <div className="job-meta">
          <div className="left-meta">
            <div className="meta-item">
              <MdLocationOn className="meta-icon" />
              <p>{location}</p>
            </div>
            <div className="meta-item">
              <BsBriefcaseFill className="meta-icon" />
              <p>{employmentType}</p>
            </div>
          </div>

          <p className="package">{packagePerAnnum}</p>
        </div>

        <hr className="line" />
        <h1 className="desc-title">Description</h1>
        <p className="desc">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
