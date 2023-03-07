// Write your code here
import {Component} from 'react'

import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    vaccinationData: {},
  }

  componentDidMount() {
    this.getApiList()
  }

  getApiList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const url = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(url)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(each => ({
          dose1: each.dose_1,
          dose2: each.dose_2,
          vaccineDate: each.vaccine_date,
        })),
        vaccinationByAge: fetchedData.vaccination_by_age.map(eachAge => ({
          age: eachAge.age,
          count: eachAge.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(eachGen => ({
          count: eachGen.count,
          gender: eachGen.gender,
        })),
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        vaccinationData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderVaccinationSuccessView = () => {
    const {vaccinationData} = this.state
    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  renderVaccinationFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="para-error">Something went wrong</h1>
    </div>
  )

  renderVaccinationLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderVaccinationDataStats = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationSuccessView()
      case apiStatusConstants.failure:
        return this.renderVaccinationFailureView()
      case apiStatusConstants.inProgress:
        return this.renderVaccinationLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="CowinDashboard-container">
        <div className="inner-cowinDashboard-container">
          <div className="cowin-image-name-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="website-logo"
            />
            <p className="cowin-heading">Co-WIN</p>
          </div>
          <h1 className="main-heading">CoWIN Vaccination In India</h1>
          {this.renderVaccinationDataStats()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
