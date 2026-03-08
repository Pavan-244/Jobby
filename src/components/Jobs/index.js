import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import ProfileCard from '../ProfileCard'
import JobCard from '../JobCard'
import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileStatus: apiStatus.initial,
    profileData: null,

    jobsStatus: apiStatus.initial,
    jobsList: [],

    searchInput: '',
    selectedEmploymentTypes: [],
    selectedSalaryRange: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({profileStatus: apiStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const profile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profileData: profile, profileStatus: apiStatus.success})
    } else {
      this.setState({profileStatus: apiStatus.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobsStatus: apiStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {
      searchInput,
      selectedEmploymentTypes,
      selectedSalaryRange,
    } = this.state
    const employmentParam = selectedEmploymentTypes.join(',')
    const minimumPackage = selectedSalaryRange
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentParam}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const jobsList = data.jobs.map(each => ({
        id: each.id,
        title: each.title,
        rating: each.rating,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        jobDescription: each.job_description,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
      }))
      this.setState({jobsList, jobsStatus: apiStatus.success})
    } else {
      this.setState({jobsStatus: apiStatus.failure})
    }
  }

  // ---- Profile rendering helpers ----
  renderProfileLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailure = () => (
    <div className="profile-failure-view">
      <button type="button" className="retry-btn" onClick={this.getProfile}>
        Retry
      </button>
    </div>
  )

  renderProfile = () => {
    const {profileStatus, profileData} = this.state
    switch (profileStatus) {
      case apiStatus.inProgress:
        return this.renderProfileLoader()
      case apiStatus.success:
        return <ProfileCard profile={profileData} />
      case apiStatus.failure:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  // ---- Jobs rendering helpers ----
  renderJobsLoader = () => (
    <div className="loader-container jobs-loader" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetryJobs = () => this.getJobs()

  renderJobsFailure = () => (
    <div className="jobs-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={this.onRetryJobs}>
        Retry
      </button>
    </div>
  )

  renderNoJobs = () => (
    <div className="no-jobs-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-desc">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsSuccess = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return this.renderNoJobs()
    }
    return (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </ul>
    )
  }

  renderJobs = () => {
    const {jobsStatus} = this.state
    switch (jobsStatus) {
      case apiStatus.inProgress:
        return this.renderJobsLoader()
      case apiStatus.success:
        return this.renderJobsSuccess()
      case apiStatus.failure:
        return this.renderJobsFailure()
      default:
        return null
    }
  }

  // ---- Filters & search handlers ----
  onChangeSearch = event => this.setState({searchInput: event.target.value})

  onClickSearch = () => {
    this.getJobs()
  }

  onKeyDownSearch = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  toggleEmploymentType = id => {
    this.setState(prevState => {
      const {selectedEmploymentTypes} = prevState
      const isPresent = selectedEmploymentTypes.includes(id)
      if (isPresent) {
        return {
          selectedEmploymentTypes: selectedEmploymentTypes.filter(
            each => each !== id,
          ),
        }
      }
      return {selectedEmploymentTypes: [...selectedEmploymentTypes, id]}
    }, this.getJobs)
  }

  onChangeSalary = id => {
    this.setState({selectedSalaryRange: id}, this.getJobs)
  }

  // ---- UI ----
  renderEmploymentFilters = () => (
    <div className="filters-section">
      <h1 className="filters-title">Type of Employment</h1>
      <ul className="filters-list">
        {employmentTypesList.map(each => (
          <li className="checkbox-item" key={each.employmentTypeId}>
            <input
              type="checkbox"
              id={each.employmentTypeId}
              onChange={() => this.toggleEmploymentType(each.employmentTypeId)}
            />
            <label htmlFor={each.employmentTypeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderSalaryFilters = () => (
    <div className="filters-section">
      <h1 className="filters-title">Salary Range</h1>
      <ul className="filters-list">
        {salaryRangesList.map(each => (
          <li className="radio-item" key={each.salaryRangeId}>
            <input
              type="radio"
              id={each.salaryRangeId}
              name="salary"
              onChange={() => this.onChangeSalary(each.salaryRangeId)}
            />
            <label htmlFor={each.salaryRangeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderSearchInput = () => {
    const {searchInput} = this.state
    return (
      <div className="search-input-container">
        <input
          type="search"
          value={searchInput}
          onChange={this.onChangeSearch}
          onKeyDown={this.onKeyDownSearch}
          placeholder="Search"
          className="search-input"
        />
        <button
          type="button"
          className="search-btn"
          onClick={this.onClickSearch}
          data-testid="searchButton"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  render() {
    return (
      <div className="jobs-bg">
        <Header />
        <div className="jobs-content">
          <aside className="left-panel">
            {this.renderProfile()}
            <hr className="separator" />
            {this.renderEmploymentFilters()}
            <hr className="separator" />
            {this.renderSalaryFilters()}
          </aside>

          <section className="right-panel">
            {this.renderSearchInput()}
            {this.renderJobs()}
          </section>
        </div>
      </div>
    )
  }
}

export default Jobs
