import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import "../assets/scss/calendarWidget.scss";
import ModalWindow from "../UI/ModalWindow";
import CalendarForm from "./CalendarForm";
import ReactTooltip from "react-tooltip";
import moment from "moment";
class CalendarWidget extends Component {
  calendarComponentRef = React.createRef();
  state = {
    modal: false,
    calendarTitle: "",
    startDate: "",
    endDate: "",
    description: "",
    action: "add",
    id: 3,
    events: [],
    eventInfo: "",
    updateId: "",
    checked: false,
    error: ""
  };

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  handleDateClick = arg => {
    this.setState({
      action: "add",
      modal: !this.state.modal,
      startDate: arg.dateStr,
      endDate: arg.dateStr
    });
  };

  handleChange = e => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  handleEventPositioned = arg => {
    arg.el.setAttribute("data-tip", arg.event.extendedProps.description);
  };

  closeModal = e => {
    this.setState({
      modal: !this.state.modal,
      calendarTitle: "",
      startDate: "",
      endDate: "",
      description: "",
      checked: false
    });
  };

  //Submitting Calendar Event Functions

  handleEventForm = () => {
    return (
      <CalendarForm
        calendarTitle={this.state.calendarTitle}
        handleChange={this.handleChange}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        description={this.state.description}
        closeModal={this.closeModal}
        checked={this.state.checked}
      ></CalendarForm>
    );
  };

  submitCalendarFooter = () => {
    return (
      <>
        <button
          className="tt-button"
          type="submit"
          onClick={this.submitCalendar}
        >
          Save
        </button>
        <button type="reset" className="tt-button" onClick={this.closeModal}>
          Cancel
        </button>
      </>
    );
  };

  submitCalendar = e => {
    e.preventDefault();
    let color = "#1abc9c";
    if (this.state.checked) {
      color = "#a70707";
    }
    this.setState(
      {
        events: [
          ...this.state.events,
          {
            id: this.state.id,
            title: this.state.calendarTitle,
            start: this.state.startDate,
            end: this.state.endDate,
            color: color,
            textColor: "White",
            description: this.state.description
              ? this.state.description
              : "no description"
          }
        ],
        modal: !this.state.modal,
        id: this.state.id + 1,
        calendarTitle: "",
        startDate: "",
        endDate: "",
        description: "",
        holidayChecked: false
      },
      function() {
        console.log(this.state.events);
      }
    );
  };

  //Updating Calendar Functions
  eventClick = arg => {
    let title = arg.event.title;
    let start = moment(arg.event.start).format("YYYY-MM-DD");
    let end = moment(arg.event.end).format("YYYY-MM-DD");
    if (end === "Invalid date") {
      end = start;
    }
    let checked;
    if (arg.event.backgroundColor === "#a70707") {
      checked = true;
    } else {
      checked = false;
    }
    let description = arg.event.extendedProps.description;
    let id = arg.event.id;
    this.setState({
      action: "edit",
      modal: !this.state.modal,
      calendarTitle: title,
      startDate: start,
      endDate: end !== "Invalid date" ? end : start,
      description: description,
      updateId: id,
      eventInfo: arg,
      checked: checked
    });
  };

  updateCalendarFooter = () => {
    return (
      <>
        <button
          className="tt-button"
          type="submit"
          onClick={this.updateCalendar}
        >
          Update Event
        </button>
        <button type="reset" className="tt-button" onClick={this.deleteEvent}>
          Delete Event
        </button>
      </>
    );
  };

  updateEventForm = () => {
    return (
      <CalendarForm
        submit={this.updateCalendar}
        closeModal={this.closeModal}
        checked={this.state.checked}
        calendarTitle={this.state.calendarTitle}
        handleChange={this.handleChange}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        description={this.state.description}
      ></CalendarForm>
    );
  };

  updateCalendar = e => {
    e.preventDefault();
    let idx;
    let id = parseInt(this.state.updateId);
    let events = [...this.state.events];
    let color = "#1abc9c";
    if (this.state.checked) {
      color = "#a70707";
    }
    for (let i = 0; i < events.length; i++) {
      if (events[i]["id"] === id) {
        idx = i;
      }
    }
    let updateEvents = [...this.state.events];
    updateEvents[idx]["title"] = this.state.calendarTitle;
    updateEvents[idx]["start"] = this.state.startDate;
    updateEvents[idx]["end"] = this.state.endDate;
    updateEvents[idx]["color"] = color;
    updateEvents[idx]["description"] = this.state.description;
    this.setState(
      {
        modal: !this.state.modal,
        events: [...updateEvents],
        calendarTitle: "",
        startDate: "",
        endDate: "",
        description: "",
        updateId: "",
        checked: false
      },
      function() {
        this.state.eventInfo.event.remove();
        this.state.eventInfo.event.source.refetch();
        ReactTooltip.rebuild();
      }
    );
  };

  //Deleting Calendar Events
  deleteEvent = () => {
    let idx;
    let id = parseInt(this.state.updateId);
    let events = [...this.state.events];
    for (let i = 0; i < events.length; i++) {
      if (events[i]["id"] === id) {
        idx = i;
      }
    }
    events.splice(idx, 1);
    this.setState({
      events: events,
      modal: !this.state.modal
    });
  };

  gotoPast = () => {
    if (this.state.year.length === 4) {
      this.setState({ error: "" });
      let date = this.state.year + "-01-01";
      let calendarApi = this.calendarComponentRef.current.getApi();
      calendarApi.gotoDate(date); // call a method on the Calendar object
    } else {
      this.setState({ error: "Enter a valid year" });
    }
  };

  render() {
    return (
      <div>
        <div className="tt-calendar-dateNavigation">
          <label htmlFor="year">Enter the year:</label>&nbsp;
          <input
            type="text"
            name="year"
            value={this.state.year}
            onChange={this.handleChange}
            className="tt-calendar-input"
            placeholder="YYYY"
            maxLength="4"
          />
          <button
            onClick={this.gotoPast}
            className="tt-button tt-calendarButton"
          >
            Go to Date
          </button>
          <p className="tt-calendarError">&nbsp;{this.state.error}</p>
        </div>
        <FullCalendar
          dateClick={this.handleDateClick}
          ref={this.calendarComponentRef}
          header={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
          }}
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          weekends={true}
          events={this.state.events}
          eventPositioned={this.handleEventPositioned}
          eventClick={this.eventClick}
        />
        <ModalWindow
          fullWidth={false}
          modal={this.state.modal}
          toggleModal={this.closeModal}
          modalHeader={
            this.state.action == "add"
              ? "Set Calendar Events"
              : "Update Calendar Events"
          }
          modalBody={
            this.state.action == "add"
              ? this.handleEventForm()
              : this.updateEventForm()
          }
          modalFooter={
            this.state.action == "add"
              ? this.submitCalendarFooter()
              : this.updateCalendarFooter()
          }
        ></ModalWindow>
        <ReactTooltip></ReactTooltip>
      </div>
    );
  }
}

export default CalendarWidget;
