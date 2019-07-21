import React, { Component } from 'react';

class CollegeList extends Component {

	render() {
		var userScoreA = "";
		var min = 800, max = 1000;
		if (this.props.SAT_M_25 !== "")
			min = parseInt(this.props.SAT_M_25);
		if (this.props.SAT_V_25 !== "")
			min += parseInt(this.props.SAT_V_25);
		if (this.props.SAT_M_75 !== "")
			max = parseInt(this.props.SAT_M_75);
		if (this.props.SAT_V_75 !== "")
			max += parseInt(this.props.SAT_V_75);
		if (max > 1600)
			max = 1600

		if (this.props.score < min)
			userScoreA = "Reach";
		else if (this.props.score >= min && this.props.score < max)
			userScoreA = "Match";
		else
			userScoreA = "Safety";
		return (
			<div>
				<div className="container-fluid card" >
					<div className="card-heade row">
						<div className="col-9">
							<div className="row">
								<div className="col-5 college-pic">
									<img src="img/uni-image.png" alt="ss" />
								</div>
								<div className="col-7 college-name">
									<h4>{this.props.ORG_ABBREV_NM}</h4>
									<p className="college-loc">{this.props.CB_REGION_CD},{this.props.MAIL_STATE_CD}</p>
								</div>
							</div>
						</div>
						<div className="col-3 add-btn-cont">
							<button type="button" className="btn btn-outline-dark add add-btn" style={{ display: "none" }}><img
								src="img/add.png" alt="add" /><br />Add</button>
							<button type="button" className="btn btn-outline-dark add added-btn" style={{ display: "block" }}><img
								src="img/added.png" alt="added" /><br />Added</button>
						</div>
					</div>
					<div className="divider">
						<div className="card-statastics row">
							<div className="col-4">
								<img src="img/gratuate.png" alt="gratuate" /><br />
								<p className="amount">{this.props.GRAD_6_YR_RATE_PCT}%</p>
								<p>Gratuate rate</p>
							</div>
							<div className="col-4">
								<img src="img/cost.png" alt="avg cost" /><br />
								<p className="amount">$9K</p>
								<p>Avg cost after aid</p>
							</div>
							<div className="col-4">
								<img src="img/undergrate.png" alt="Under grate" /><br />
								<p className="amount">{this.props.ENROLL_UG_TOTAL_DEG}</p>
								<p>Total undergrades</p>
							</div>
						</div>
						<div className="card-match">
							<div className="match-title">
								<p>{userScoreA}</p>
							</div>
							<div className="match-text">
								<p>Your <span className="bold">Estimated SAT is lower</span> than the average score range of
							admitted and enrolled students</p>
							</div>
							<div className="match-range-cont">
								<label className="min-lim-num">600</label>
								<div className="range-bar">

									<div className="your-point " style={{ left: (this.props.score - 600) / 10 + "%" }}
										data-toggle="tooltip" data-placement="top"
										title="YOU">	 </div>
									<div id="tooltip" className="top on" style={{ left: (this.props.score - 600) / 10 + "%" }}>
										<div className="tooltip-arrow"></div>
										<div className="tooltip-label">YOU</div>
									</div>

									<div className="avrg-range" style={{ left: (min - 600) / 10 + "%", width: (max - min) / 10 + "%" }}>
										<p>{min}- {max}</p>
									</div>
									<label className="max-lim-num">1600</label>

								</div>

							</div>
						</div>
					</div>
				</div>
			</div >
		);
	}
}


export default CollegeList;
