import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';

class SearchBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filterCount: 0,
			//Variale for Dialog
			selectedRegion: "Regions:",
			schoolYear: [false, false],
			privacyOption: [false, false],
			schoolSize: [false, false, false],

		}

		this.regionChange = this.regionChange.bind(this);
		this.schoolSizeChange = this.schoolSizeChange.bind(this);
		this.privacyChange = this.privacyChange.bind(this);
		this.schoolYearChange = this.schoolYearChange.bind(this);

		this.clearFilter = this.clearFilter.bind(this);
		this.applyFilter = this.applyFilter.bind(this);

		this.setFilterCount = this.setFilterCount.bind(this);

	}
	componentWillMount() {
		this.setState({
			selectedRegion: this.props.filter1,
			schoolYear: this.props.filter2,
			privacyOption: this.props.filter3,
			schoolSize: this.props.filter4
		})
	}



	//filter
	clearFilter() {
		this.setState({
			selectedRegion: "Regions:",
			schoolYear: [false, false],
			privacyOption: [false, false],
			schoolSize: [false, false, false]
		})
	}
	schoolSizeChange(val) {
		var temp = this.state.schoolSize;
		temp[val] = !temp[val];
		this.setState({
			schoolSize: temp
		}, () => this.setFilterCount());
	}
	schoolYearChange(val) {
		var temp = this.state.schoolYear;
		temp[val] = !temp[val];
		this.setState({
			schoolYear: temp
		}, () => this.setFilterCount());
	}
	regionChange(e) {
		this.setState({ selectedRegion: e.target.value }, () => this.setFilterCount());
	}
	privacyChange(val) {
		var temp = this.state.privacyOption;
		temp[val] = !temp[val];
		this.setState({
			privacyOption: temp
		}, () => this.setFilterCount());
	}

	////Set Filtered Result on Main Panel
	applyFilter() {
		this.props.applyFilter(this.state.selectedRegion, this.state.schoolYear, this.state.privacyOption, this.state.schoolSize);
	}
	closeFilterDialog() {
		this.props.closeDialog();
	}

	setFilterCount() {
		var filterCount = 0;
		var f1 = this.state.selectedRegion;
		var f2 = this.state.schoolYear;
		var f3 = this.state.privacyOption;
		var f4 = this.state.schoolSize;
		if (f1 !== "Regions:" && f1 !== "States:") {
			filterCount += 1;
		}
		//School Year Filter
		if (f2[0] === true || f2[1] === true) {
			filterCount += 1;
		}
		//Privacy Optin Fiilter
		if (f3[0] === true || f3[1] === true) {
			filterCount += 1;
		}
		//School Size Filter
		if (f4[0] === true || f4[1] === true || f4[2] === true) {
			filterCount += 1;
		}
		this.setState({
			filterCount: filterCount
		})
	}

	Change() {

	}
	render() {
		var cityArray = [], stateArray = [];

		if (this.props.cityArray !== undefined)
			cityArray = this.props.cityArray;
		if (this.props.stateArray !== undefined)
			stateArray = this.props.stateArray;

		return (
			<div className="modalDialog">

				<div className="modal-dialog" role="document">
					<form>
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLabel"><i className="fas fa-sliders-h"></i> Filters (<span className="filter-count">{this.state.filterCount}</span>)</h5>
								<button className="close" onClick={() => this.closeFilterDialog()}>
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="filter-item location">
									<p className="filter-title">Location</p>
									<div className="form-group">
										<label>Regions/States</label>
										<select className="form-control"
											value={this.state.selectedRegion}
											onChange={(e) => this.regionChange(e)}>
											<option style={{ fontWeight: "bold", fontSize: "15px" }}>Regions:</option>
											{cityArray.map((e, index) =>
												<option key={index}> {e} </option>
											)}
											<option style={{ fontWeight: "bold", fontSize: "15px" }}>States:</option>
											{stateArray.map((e, index) =>
												<option key={index}> {e} </option>
											)}
										</select>
									</div>
								</div>

								<div className="filter-item year">
									<p className="filter-title">2-Year or 4-Year</p>
									<div className="form-group">
										<div className="form-check" onClick={() => this.schoolYearChange(0)}>
											<input className="form-check-input" type="checkbox" checked={this.state.schoolYear[0]} onChange={() => this.Change()} />
											<label className="form-check-label" >2-year/community college</label>
										</div>
										<div className="form-check" onClick={() => this.schoolYearChange(1)}>
											<input className="form-check-input" type="checkbox" checked={this.state.schoolYear[1]} onChange={() => this.Change()} />
											<label className="form-check-label">4-year/community college</label>
										</div>
									</div>
								</div>

								<div className="filter-item public-private">
									<p className="filter-title">Public or Private</p>
									<div className="form-group">
										<div className="form-check" onClick={() => this.privacyChange(0)}>
											<input className="form-check-input" type="checkbox" checked={this.state.privacyOption[0]} onChange={() => this.Change()} />
											<label className="form-check-label" >Public</label>
										</div>
										<div className="form-check" onClick={() => this.privacyChange(1)}>
											<input className="form-check-input" type="checkbox" checked={this.state.privacyOption[1]} onChange={() => this.Change()} />
											<label className="form-check-label" >Private</label>
										</div>
									</div>
								</div>

								<div className="filter-item school-size">
									<p className="filter-title">School Size</p>
									<div className="form-group">
										<div className="form-check" onClick={() => this.schoolSizeChange(0)}>
											<input className="form-check-input" type="checkbox" checked={this.state.schoolSize[0]} onChange={() => this.Change()} />
											<label >Small (Less than 2,000)</label>
										</div>
										<div className="form-check" onClick={() => this.schoolSizeChange(1)}>
											<input className="form-check-input" type="checkbox" checked={this.state.schoolSize[1]} onChange={() => this.Change()} />
											<label >Medium (2,000-15,000)</label>
										</div>
										<div className="form-check" onClick={() => this.schoolSizeChange(2)}>
											<input className="form-check-input" type="checkbox" checked={this.state.schoolSize[2]} onChange={() => this.Change()} />
											<label >Large (Greater than 15,000)</label>
										</div>
									</div>
								</div>

							</div>
							<div className="modal-footer">
								<div className="clear-all-btn" onClick={() => this.clearFilter()}>Clear All</div>

								<button type="button" className="btn btn-primary apply-btn" onClick={() => this.applyFilter()}>Apply</button>

							</div>
						</div>
					</form>
				</div>
			</div>

		);
	}
}


export default SearchBox;
