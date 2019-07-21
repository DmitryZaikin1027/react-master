import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import Search from '../SearchBox.js';
import CollegeList from '../collegeList.js';
import 'font-awesome/css/font-awesome.min.css';


class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			filteredArray: [],
			searchBoxVisible: false,

			page_num: 1,

			filterCount: 0,
			//Filter Variable
			sortType: "0",

			topFilter: 0,
			searchText: "",
			f1: "Regions:",
			f2: [false, false],
			f3: [false, false],
			f4: [false, false, false]
		}

		//		this.getData = this.getData.bind(this);
		this.updateData = this.updateData.bind(this);
		this.openFilterDialog = this.openFilterDialog.bind(this);
		this.closeDialog = this.closeDialog.bind(this);

		this.onSearchTextChange = this.onSearchTextChange.bind(this);
		this.sortTypeChange = this.sortTypeChange.bind(this);

		this.applyDialogFilter = this.applyDialogFilter.bind(this);
		this.applyTextSearch = this.applyTextSearch.bind(this);

		this.applyFilter = this.applyFilter.bind(this);
	}
	componentWillMount() {
		var csvFilePath = require("./colleges_v2.csv");
		var Papa = require("papaparse/papaparse.min.js");
		Papa.parse(csvFilePath, {
			header: true,
			download: true,
			skipEmptyLines: true,
			complete: this.updateData
		});


	}
	updateData(result) {
		const data = result.data;
		//Setup location Array
		var StateData = [], locationData = [];
		for (var i = 0; i < result.data.length; i++)
			StateData.push(result.data[i]["MAIL_STATE_CD"]);
		for (i = 0; i < result.data.length; i++)
			locationData.push(result.data[i]["CB_REGION_CD"]);
		const distinct = (value, index, self) => {
			return self.indexOf(value) === index && value !== '';
		}
		const locationArray1 = StateData.filter(distinct);
		const locationArray2 = locationData.filter(distinct);
		locationArray1.sort();
		locationArray2.sort();

		// Here this is available and we can call this.setState (since it's binded in the constructor)
		this.setState({
			data: data,
			filteredArray: data,
			stateArray: locationArray1,
			cityArray: locationArray2
		}, () => this.applyFilter()); // or shorter ES syntax: this.setState({ data });

	}

	openFilterDialog() {
		this.setState({
			searchBoxVisible: true
		})
	}
	closeDialog() {
		this.setState({
			searchBoxVisible: false
		})
	}
	handleScroll = e => {

		let element = e.target
		if (element.scrollHeight - element.scrollTop === element.clientHeight) {
			// do something at end of scroll
			this.setState({
				page_num: this.state.page_num + 1
			})
		}
	}

	setTopFilter(value) {
		this.setState({
			topFilter: value
		}, () => this.applyFilter())
	}
	applyDialogFilter(filter1, filter2, filter3, filter4) {
		this.closeDialog();
		this.setState({
			f1: filter1,
			f2: filter2,
			f3: filter3,
			f4: filter4
		}, () => this.applyFilter());
		this.setFilterCount(filter1, filter2, filter3, filter4);
	}

	onSearchTextChange(e) {
		this.setState({
			searchText: e.target.value
		}, () => this.applyFilter())

	}
	applyTextSearch() {
		this.applyFilter();
	}

	sortTypeChange(event) {
		this.setState({
			sortType: event.target.value
		}, () => this.applySort());
	}
	//
	clearFilter() {
		this.setState({
			f1: "Regions:",
			f2: [false, false],
			f4: [false, false, false],
			filterCount: 0
		}, () => this.applyFilter())
	}

	setFilterCount(filter1, filter2, filter3, filter4) {
		var filterCount = 0;
		var f1 = filter1;
		var f2 = filter2;
		var f3 = filter3;
		var f4 = filter4;
		if (f1 !== "Regions:" && f1 !== "States:") {
			filterCount += 1;
		}
		//School Year Filter
		if (f2[0] === true || f2[1] === true) {
			filterCount += 1;
		}
		//Privacy Option Filter
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
	applySort() {
		var temp = this.state.filteredArray;

		switch (this.state.sortType) {
			case "0":
				temp.sort(function (a, b) {
					return (a["ORG_FULL_NM"] === b["ORG_FULL_NM"]) ? 0 : (a["ORG_FULL_NM"] > b["ORG_FULL_NM"]) ? 1 : -1;
				});
				break;
			case "1":
				temp.sort(function (a, b) {
					return (a["ORG_FULL_NM"] === b["ORG_FULL_NM"]) ? 0 : (a["ORG_FULL_NM"] < b["ORG_FULL_NM"]) ? 1 : -1;
				});
				break;
			case "2":

				break;
			case "3":
				temp.sort(function (a, b) {
					var x = parseInt(a["GRAD_6_YR_RATE_PCT"]);
					var y = parseInt(b["GRAD_6_YR_RATE_PCT"]);
					if (a["GRAD_6_YR_RATE_PCT"] === '')
						x = 0;
					if (b["GRAD_6_YR_RATE_PCT"] === '')
						y = 0;
					return y - x;
					//					return (x === y) ? 0 : (x > y) ? 1 : -1;
				});
				break;
			default:
				break;
		}
		this.setState({
			filteredArray: temp
		})
	}
	applyFilter() {

		var dataArray = this.state.data;
		var filteredArray = [];

		/* Set Search Term */
		var searchText = this.state.searchText;
		searchText = searchText.replace(/\s/g, '');
		var f1 = this.state.f1;
		var f2 = this.state.f2;
		var f4 = this.state.f4;
		var topFilter = this.state.topFilter;
		for (var i = 0; i < dataArray.length; i++) {
			var temp = dataArray[i];
			var status0 = false, status1 = false, status3 = false;
			var topFilterStatus = false;

			//Top Radio Filter
			var score = 1300;
			var min = 800, max = 1000;
			if (temp["FRESH_SAT_I_M_25_PCTL"] !== "")
				min = parseInt(temp["FRESH_SAT_I_M_25_PCTL"]);
			if (temp["FRESH_SAT_I_V_25_PCTL"] !== "")
				min += parseInt(temp["FRESH_SAT_I_V_25_PCTL"]);
			if (temp["FRESH_SAT_I_M_75_PCTL"] !== "")
				max = parseInt(temp["FRESH_SAT_I_M_75_PCTL"]);
			if (temp["FRESH_SAT_I_V_75_PCTL"] !== "")
				max += parseInt(temp["FRESH_SAT_I_V_75_PCTL"]);

			if (max > 1600)
				max = 1600
			if (topFilter === 0)
				topFilterStatus = true;
			else if (topFilter === 1) {
				if (score < min)
					topFilterStatus = true;
			}
			else if (topFilter === 2) {
				if (score >= min && score < max)
					topFilterStatus = true;
			}
			else {
				if (score >= max)
					topFilterStatus = true;
			}
			//Location Filter
			if (f1 === "Regions:" || f1 === "States:")
				status0 = true;
			else if (temp["MAIL_STATE_CD"] === f1 || temp["CB_REGION_CD"] === f1) {
				status0 = true;
			}
			//School Year Filter
			if (f2[0] !== true && f2[1] !== true)
				status1 = true;

			else {
				if (f2[0] && temp["UNDERGRAD_GRADE_CD"] === "2")
					status1 = true;
				if (f2[1] && temp["UNDERGRAD_GRADE_CD"] === "5")
					status1 = true;
			}

			//School Size Filter
			if (f4[0] !== true && f4[1] !== true && f4[2] !== true)
				status3 = true;
			else {
				//	console.log(temp[11])
				if (f4[0] && parseInt(temp["ENROLL_UG_TOTAL_DEG"]) <= 2000)
					status3 = true;
				if (f4[1] && parseInt(temp["ENROLL_UG_TOTAL_DEG"]) > 2000 && parseInt(temp["ENROLL_UG_TOTAL_DEG"]) <= 15000)
					status3 = true;
				if (f4[2] && parseInt(temp["ENROLL_UG_TOTAL_DEG"]) > 15000)
					status3 = true;
			}
			//Combine Filter Result
			if (topFilterStatus && status0 && status1 && status3)
				filteredArray.push(temp);
		}

		/* Filter by search Text */
		const distinct = (value) => {
			//			console.log(value["ORG_FULL_NM"].toLowerCase())
			return value["ORG_FULL_NM"].toLowerCase().replace(/\s/g, '').indexOf(searchText) !== -1;
		}
		filteredArray = filteredArray.filter(distinct);


		this.setState({
			filteredArray: filteredArray
		}, () => this.applySort())
	}


	render() {

		var end = this.state.page_num * 5;
		var count = this.state.filteredArray.length;
		var score = 1300;
		return (
			<div style={{ height: "100%", overflow: "hidden" }}>
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
					<div className="navbar-brand" href="#"><img src={process.env.PUBLIC_URL + "img/logo.png"} alt="logo" /></div>
					<div className="header-title">
						<h3 className="title"><img src={process.env.PUBLIC_URL + "img/access.png"} alt="access" /></h3>
					</div>
				</nav>
				<div className="main-container">
					<div className="row-fluid filter-container" style={this.state.filterCount > 0 ? { backgroundColor: "lightgray" } : { backgroundColor: "transparent" }}>

						<button className="btn btn-outline-dark btn-lg btn-block" onClick={this.openFilterDialog}>
							<i className="fas fa-sliders-h"></i>
							Filters (<span className="filter-count">{this.state.filterCount}</span>)
						</button>

					</div>{this.state.filterCount !== 0 ?
						<div style={{ fontSize: "12px", textAlign: "center", textDecoration: "underline" }} onClick={() => this.clearFilter()}>Clear All</div>
						: undefined}
					<div className="row tabs">
						<ul className="nav nav-pills">
							<li className="nav-item" onClick={() => this.setTopFilter(0)}>
								<div className="nav-link " >
									<p>All</p>
									<p>Colleges</p>
									<img src={this.state.topFilter === 0 ? "/img/radio-new-checked.ico" : "/img/radio-new.ico"} width="16" alt="radio" />
								</div>
							</li>
							<li className="nav-item" onClick={() => this.setTopFilter(1)}>
								<div className="nav-link ">
									<p>Reach</p>
									<p>Colleges</p>
									<img src={this.state.topFilter === 1 ? "/img/radio-new-checked.ico" : "/img/radio-new.ico"} width="16" alt="radio" />
								</div>
							</li>
							<li className="nav-item" onClick={() => this.setTopFilter(2)}>
								<div className="nav-link ">
									<p>Match</p>
									<p>Colleges</p>
									<img src={this.state.topFilter === 2 ? "/img/radio-new-checked.ico" : "/img/radio-new.ico"} width="16" alt="radio" />
								</div>
							</li>
							<li className="nav-item" onClick={() => this.setTopFilter(3)}>
								<div className="nav-link ">
									<p>Safety</p>
									<p>Colleges</p>
									<img src={this.state.topFilter === 3 ? "/img/radio-new-checked.ico" : "/img/radio-new.ico"} width="16" alt="radio" />
								</div>
							</li>
						</ul>
					</div>
					<div style={{ margin: "5px", display: "flex" }}>
						<div style={{ display: "inline-block", flex: "1" }}>
							<input className="searchBox" placeholder="Search for Colleges" value={this.state.searchText} onChange={this.onSearchTextChange} />
						</div>
						<button type="button" className="searchButton" onClick={this.applyTextSearch}><i className="fa fa-search"></i></button>
					</div>
					<div style={{ margin: "10px" }}>
						<div>
							<div style={{ float: "left", fontWeight: "bold" }}>{count} colleges</div>
							<select className="dropdownMenu" value={this.state.sortType} onChange={this.sortTypeChange}>
								<option value="0" className="dropdownItem">A - Z</option>
								<option value="1" className="dropdownItem">Z - A</option>
								<option value="2" className="dropdownItem">Avg Cost</option>
								<option value="3" className=" dropdownItem">Graduation Rate</option>
							</select>
						</div>
					</div>
					<div className="cardContainer" onScroll={this.handleScroll}>
						<div id="card-holder" >
							{
								this.state.filteredArray.map((e, index) => {
									if (index >= 0 && index < end) {
										return (<CollegeList key={index}
											ORG_ABBREV_NM={e["ORG_ABBREV_NM"]}
											GRAD_6_YR_RATE_PCT={e["GRAD_6_YR_RATE_PCT"]}
											CB_REGION_CD={e["CB_REGION_CD"]}
											MAIL_STATE_CD={e["MAIL_STATE_CD"]}
											ENROLL_UG_TOTAL_DEG={e["ENROLL_UG_TOTAL_DEG"]}
											SAT_M_25={e["FRESH_SAT_I_M_25_PCTL"]}
											SAT_V_25={e["FRESH_SAT_I_V_25_PCTL"]}
											SAT_M_75={e["FRESH_SAT_I_M_75_PCTL"]}
											SAT_V_75={e["FRESH_SAT_I_V_75_PCTL"]}
											score={score}
										/>);
									}
									return 0;
								})

							}

						</div>
					</div>
				</div>
				<Popup open={this.state.searchBoxVisible} closeOnDocumentClick={false}>
					<Search filter1={this.state.f1}
						filter2={this.state.f2}
						filter3={this.state.f3}
						filter4={this.state.f4}
						stateArray={this.state.stateArray}
						cityArray={this.state.cityArray}

						closeDialog={this.closeDialog}
						applyFilter={this.applyDialogFilter}
					/>
				</Popup>
				<div className="footer">
					<div href="collegelist.html" className="btn btn-light my-clg-lst">MY COLLEGE LIST <span className="list-count">4</span></div>
					<button type="button" className="btn btn-light bell-button"><i className="fa fa-bell"></i></button>
				</div>

			</div >
		);
	}
}


export default Home;
