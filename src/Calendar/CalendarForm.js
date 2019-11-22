import React, { Component } from "react";

class CalendarForm extends Component {
  state = {};
  render() {
    return (
      <form className="form-group">
        <label htmlFor="calendarTitle">Event Name: </label>
        <input
          type="text"
          id="title"
          name="calendarTitle"
          className="form-control"
          value={this.props.calendarTitle}
          onChange={this.props.handleChange}
          required
        />
        <label>Start Date:</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={this.props.startDate}
          onChange={this.props.handleChange}
          className="form-control"
          required
        />
        <label>End Date:</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={this.props.endDate}
          onChange={this.props.handleChange}
          className="form-control"
          required
        />
        <label>Choose Event Type</label>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              name="checked"
              checked={this.props.checked}
              onChange={this.props.handleChange}
            />
            Mark As Holiday
          </label>
        </div>
        <label>Description(Optional)</label>
        <textarea
          className="form-control"
          name="description"
          value={this.props.description}
          onChange={this.props.handleChange}
        ></textarea>
      </form>
    );
  }
}

export default CalendarForm;
