import {useHistory} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => {
  const history = useHistory()

  const onClickFindJobs = () => {
    history.push('/jobs')
  }

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <button className="find-jobs-btn" onClick={onClickFindJobs}>
          Find Jobs
        </button>
      </div>
    </div>
  )
}

export default Home
