import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import Header from '../Header'
import SimilarJobCard from '../SimilarJobCard'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    status: apiStatus.initial,
    jobDetails: null,
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    this.setState({status: apiStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {headers: {Authorization: `Bearer ${jwtToken}`}}
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const job = data.job_details
      const updatedJob = {
        id: job.id,
        companyLogoUrl: job.company_logo_url,
        companyWebsiteUrl: job.company_website_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        skills: job.skills.map(s => ({name: s.name, imageUrl: s.image_url})),
        lifeAtCompany: {
          description: job.life_at_company.description,
          imageUrl: job.life_at_company.image_url,
        },
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }
      const similarJobs = data.similar_jobs.map(j => ({
        id: j.id,
        title: j.title,
        rating: j.rating,
        location: j.location,
        jobDescription: j.job_description,
        companyLogoUrl: j.company_logo_url,
        employmentType: j.employment_type,
      }))
      this.setState({
        jobDetails: updatedJob,
        similarJobs,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetry = () => this.getJobData()

  renderFailure = () => (
    <div className="job-details-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderSkills = skills => (
    <ul className="skills-list">
      {skills.map(each => (
        <li key={each.name} className="skill-item">
          <img src={each.imageUrl} alt={each.name} className="skill-img" />
          <p className="skill-name">{each.name}</p>
        </li>
      ))}
    </ul>
  )

  renderSuccess = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      rating,
      title,
      packagePerAnnum,
      employmentType,
      location,
      jobDescription,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <div className="job-details-success">
        <div className="job-card job-details-card">
          <div className="job-header">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
          <div className="desc-top">
            <h1 className="desc-title">Description</h1>
            <a
              href={companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="visit-link"
            >
              Visit <BsBoxArrowUpRight className="visit-icon" />
            </a>
          </div>
          <p className="desc">{jobDescription}</p>

          <h1 className="section-title">Skills</h1>
          {this.renderSkills(skills)}

          <h1 className="section-title">Life at Company</h1>
          <div className="life-at-company">
            <p className="life-desc">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-img"
            />
          </div>
        </div>

        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map(each => (
            <SimilarJobCard key={each.id} job={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderBody = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.inProgress:
        return this.renderLoader()
      case apiStatus.success:
        return this.renderSuccess()
      case apiStatus.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-details-bg">
        <Header />
        {this.renderBody()}
      </div>
    )
  }
}

export default JobItemDetails
