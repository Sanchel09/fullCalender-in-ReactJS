import React, { Component } from "react";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class ModalWindow extends Component {
  state = {
    modalWidth: 0
  };

  componentDidMount() {
    this.setDefaultSize();
  }

  setDefaultSize = () => {
    let viewWidth = window.innerWidth - 10;
    this.setState({
      modalWidth: viewWidth + "px"
    });
  };

  getWidth = () => ({
    maxWidth: this.state.modalWidth,
    margin: 5
  });

  render() {
    return (
      <React.Fragment>
        <Modal
          style={this.props.fullWidth ? this.getWidth() : null}
          isOpen={this.props.modal}
          toggle={this.props.toggleModal}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <ModalHeader
            toggle={this.props.toggleModal}
            className="tt-group-header"
          >
            <div>{this.props.modalHeader}</div>
          </ModalHeader>
          <ModalBody>{this.props.modalBody}</ModalBody>
          <ModalFooter>{this.props.modalFooter}</ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ModalWindow;
