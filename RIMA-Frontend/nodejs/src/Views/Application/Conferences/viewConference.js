import React from "react";
import RestAPI from "../../../Services/api";
// react plugin used to create google maps
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { handleServerErrors } from "Services/utils/errorHandler";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getItem } from "../../../Services/utils/localStorage";
import Select from "react-select";
import "d3-transition";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";





// reactstrap components
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
  Container,
  Row,
  CardBody,
  FormGroup,
  Form,
  Input,
  Col,
} from "reactstrap";



class viewConference extends React.Component {
  state = {
    data: [],
    conferenceEvents: [],
    isLoding: false,
    modal: false,
    editmodal: false,
    deleteModal: false,
    deletePaperId: "",
    title: "",
    url: "",
    year: "",
    abstract: "",
    id: "",
    authors: "",
    show: false,
    selectyear: "",
    eventsmodal: "",
  };

  componentDidMount() {
    this.setState({ isLoding: true }, this.getConferenceData());
  }

  selectYear = (e) => {
    this.setState({
      selectyear: e.value,
    });
  }


  //** GET ALL CONFERENCES **//
  getConferenceData = () => {
    RestAPI.getListConference()
      .then((response) => {
        this.setState({
          isLoding: false,
          data: response.data,
        });

      })
      .catch((error) => {
        this.setState({ isLoding: false });
        handleServerErrors(error, toast.error);
      });
  };


//** GET ALL CONFERENCE EVENTS **//
getConferenceEventsData = (conference_name_abbr) => {
  console.log("TEST")
  console.log(conference_name_abbr)
  console.log("TEST")

  RestAPI.getListConfercneEvents(conference_name_abbr)
    .then((response) => {
      this.setState({
        isLoding: false,
        eventsmodal: !this.state.eventsmodal,
        conferenceEvents: response.data,
      });
    })
    .catch((error) => {
      this.setState({ isLoding: false });
      handleServerErrors(error, toast.error);
    });
};

//** COLLECT PAPERS FOR AN EVENT **//
collectEventPapers = (conference_name_abbr,conference_event_name_abbr) => {
  RestAPI.collectEventPapers(conference_name_abbr,conference_event_name_abbr)
    .then((response) => {
      this.setState({
        isLoding: false,
        eventsmodal: !this.state.eventsmodal,
        conferenceEvents: response.data,
      });
    })
    .catch((error) => {
      this.setState({ isLoding: false });
      handleServerErrors(error, toast.error);
    });
};

//** EXTRACT TRENDS OF AN EVENT **//
ExtractEventTrends = (conference_event_name_abbr) => {
  RestAPI.ExtractEventTrends(conference_event_name_abbr)
    .then((response) => {
      this.setState({
        isLoding: false,
        eventsmodal: !this.state.eventsmodal,
        conferenceEvents: response.data,
      });
    })
    .catch((error) => {
      this.setState({ isLoding: false });
      handleServerErrors(error, toast.error);
    });
};


  // Toggles the delete paper modal
  toggleDeletePaper = (id) => {
    this.setState({
      deleteModal: !this.state.deleteModal,
      deletePaperId: id,
    })
  }

  //** DELETE A PAPER **//
  deleteEnquiry = (id) => {
    this.setState({
      isLoding: true,
      deleteModal: !this.state.deleteModal,
    }, () => {
      RestAPI.deletePaper(id)
        .then((response) => {
          const newvalue = this.state.data.filter((v, i) => v.id !== id);
          this.setState({
            isLoding: false,
            data: [...newvalue],
          });

          toast.success("Paper deleted!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        })
        .catch((error) => {
          this.setState({ isLoding: false });
          handleServerErrors(error, toast.error);
        });
    });
  };

  //** SHOW A PAPERS **//
  showEnquiry = (id) => {
    const paperdata = this.state.data.find((v, i) => {
      return v.id === id;
    });
    this.setState({
      modal: !this.state.modal,
      paperDetail: paperdata,
    });
  };


  getSelectedValueBAB = () => {
    console.log("THIS IS SELECT YEAR")
    console.log(this.state.selectyear)
    console.log("THIS IS SELECT YEAR")
  };

  //** SET VALUES IN EDIT PAPERS MODAL **//
  editEnquiry = (id) => {
    const paperdata = this.state.data.find((v, i) => {
      return v.id === id;
    });
    this.setState({
      editmodal: !this.state.editmodal,
      id: paperdata.id,
      title: paperdata.title,
      url: paperdata.url,
      year: paperdata.year,
      authors: paperdata.authors,
      abstract: paperdata.abstract,
    });
  };

  toggle = (id) => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  eventstoggle = (id) => {
    this.setState({
      eventsmodal: !this.state.eventsmodal,
    });
  };


  //** UPDATE A PAPERS **//
  handleUpdate = () => {
    let data = {
      // id: this.state.id,
      title: this.state.title,
      url: this.state.url,
      year: this.state.year,
      abstract: this.state.abstract,
      authors: this.state.authors,
    };

    this.setState(
      {
        isLoding: true,
        editmodal: !this.state.editmodal,
      },
      () => {
        RestAPI.updatePaper(data, this.state.id)
          .then((response) => {
            this.setState({
              isloading: false,
            });

            this.getConferenceData();

            toast.success("Update Papaer !", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            });
          })
          .catch((error) => {
            handleServerErrors(error, toast.error);
          });
      }
    );
  };

  edittoggle = () => {
    this.setState({
      editmodal: !this.state.editmodal,
    });
  };

  handleChange = (e) => {
    let getValue = e.target.value;
    let getName = e.target.name;
    this.setState(() => ({ [getName]: getValue }));
  };

  refreshPaper = () => {
    /*
    this.setState({ isLoding1: true }, () => {
      user
        .refreshPaper()
        .then((response) => {
          toast.success("New data will be available in a few minutes!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        })
        .catch((error) => {
          this.setState({ isLoding1: false });
          handleServerErrors(error, toast.error);
        });
    });
  */
  };

  saveChanges = () => {
    /*
    this.setState({ isLoding1: true }, () => {
      user
        .refreshPaper()
        .then((response) => {
          toast.success("Data saved!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        })
        .catch((error) => {
          this.setState({ isLoding1: false });
          handleServerErrors(error, toast.error);
        });
    });
    */
  };

  render() {

    var {
      
      selectyear,
    
    } = this.state;

    return (
      <>
       
        {/* Page content */}
        <Container  fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row style={{ alignItems: "center" }}>
                    <Col>
                      <h2 className="mb-0">
                        Conferences List
                      </h2>
                    </Col>
                  </Row>
                </CardHeader>

                <Table className="align-items-center table-flush" responsive>

                  <thead className="thead-light">
                    <tr>

                     <th scope="col">Conference</th>
                      <th scope="col">Conference URL</th>
                      <th scope="col">Platform</th>
                      <th scope="col">Platform URl</th>
                      <th scope="col">Number of Events</th>
                      <th scope="col" width="5">Options</th>
                      
                      <th scope="col" width="5"></th>
                      <th scope="col" width="5"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* START LOADER */}

                    {this.state.isLoding ? (
                      <tr className="text-center" style={{ padding: "20px" }}>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: "center" }}>
                          {" "}
                          <Loader
                            type="Puff"
                            color="#00BFFF"
                            height={100}
                            width={100}
                          />
                        </td>
                      </tr>
                    ) : this.state.data.length ? (
                      this.state.data.map((value, index) => (
                        <tr key={value.platform_name}>
                          <td>{value.conference_name_abbr}</td>
                          <td><a href ={ value.conference_url}>{value.conference_url}</a></td>
                          <td>{value.platform_name}</td>
                          <td><a href ={value.platform_url}>{value.platform_url}</a></td>
                          <td align = "center">{value.no_of_events}</td>
                          <td>
                          <div align="left">
                                  <UncontrolledDropdown>
                                    <DropdownToggle
                                      className="btn-icon-only text-light"
                                      href="#pablo"
                                      role="button"
                                      size="sm"
                                      color=""
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      <i className="fas fa-ellipsis-v" />
                                    </DropdownToggle>
                                    <DropdownMenu
                                      className="dropdown-menu-arrow"
                                      right
                                    >
                                      <DropdownItem
                                        onClick={() => this.showEnquiry(value.id)}
                                      >
                                        View
                                    </DropdownItem>

                                      <Link to={`/app/edit-paper/${value.id}`}>
                                        <DropdownItem
                                        //  onClick={()=>this.editEnquiry(value.id)}
                                        >
                                          Edit
                                      </DropdownItem>
                                      </Link>
                                      <DropdownItem
                                        // onClick={() => this.deleteEnquiry(value.id)}
                                        onClick={() => this.toggleDeletePaper(value.id)}
                                      >
                                        Remove
                                    </DropdownItem>
                                    </DropdownMenu>
                                 </UncontrolledDropdown>
                                 </div>
                          </td>
                       
                          
                          <td className="text-center">
                          <Link to={"/app/view-author"}>
                              <Button color="secondary"  width = "50px">
                              Authors Dashboard
                              </Button>
                           </Link> 
                          </td>
                          <td className="text-center">
                              <Button color="secondary" onClick={() => this.getConferenceEventsData(value.conference_name_abbr)} width = "50px">
                                Stored Events
                              </Button>    
                          </td>
                        </tr>
                      ))
                    ) : (
                          <tr className="text-center1" style={{ padding: "20px" }}>
                            <td></td>
                            <td style={{ textAlign: "right" }}>
                              {" "}
                              <strong> No Papers Found</strong>
                            </td>
                          </tr>
                        )}
                  </tbody>
                </Table>
              
               <br/>
               <br/>
               <br/>
               <br/>
               <br/>
               <br/>
               <br/>
                <div style={{ display: "flex", margin: " 0 53px 25px 25px", justifyContent: "space-between" }}>
                  <div style={{ margin: "32px 0px 0px 0px" }}>
                    <div align="right">
                      <Link to={"/app/add-conference"}>
                        <Button color="primary">
                          Add new Conference
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>


              {/* //  Start Modal */}
              <div>
                <Modal isOpen={this.state.deleteModal} toggle={() => this.toggleDeletePaper("")} size="lg">
                  <ModalHeader toggle={() => this.toggleDeletePaper("")}>
                    <h2>
                      Remove paper?
                    </h2>
                  </ModalHeader>
                  <ModalBody>
                    <h4>You are about to delete the publication from the list! Are you sure?</h4>
                  </ModalBody>
                  <ModalFooter>
                    <Button varian="link" onClick={() => this.toggleDeletePaper("")}>
                      Cancel
                    </Button>
                    <Button color="danger" onClick={() => this.deleteEnquiry(this.state.deletePaperId)}>
                      Delete
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
              <div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg">
                  <ModalHeader toggle={this.toggle}>Paper Detail</ModalHeader>
                  <ModalBody>
                    <strong>Title: </strong>{" "}
                    {this.state.conferenceEvents && this.state.conferenceEvents.title}
                    <br />
                    <br />
                    <strong>Year: </strong>{" "}
                    {this.state.conferenceEvents && this.state.conferenceEvents.year}
                    <br />
                    <br />
                    <strong>Authors: </strong>{" "}
                    {this.state.conferenceEvents && this.state.conferenceEvents.authors}
                    <br />
                    <br />
                    <strong>Source: </strong>{" "}
                    <a href={this.state.conferenceEvents && this.state.conferenceEvents.url}>See paper on Semantic Scholar</a>

                    <br />
                    <br />
                    <strong>Abstract: </strong>
                    {this.state.conferenceEvents && this.state.conferenceEvents.abstract}
                  </ModalBody>

                  <ModalFooter>
                    <Button color="primary" onClick={this.toggle}>
                      OK
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>

               <div>
                <Modal isOpen={this.state.eventsmodal} toggle={this.eventstoggle} size="lg">
                  <ModalHeader toggle={this.eventstoggle}>Conference Events</ModalHeader>
                  <ModalBody>

                  <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Conference</th>
                      <th scope="col">Conference Event</th>
                      {/*<th scope="col">URL</th>*/}
                      <th scope="col">Conference URL</th>
                      <th scope="col">No. Stored Papers</th>
                      <th scope="col" width="5"></th>
                      <th scope="col" width="5"></th>
                    </tr>
                  </thead>
                  

                  <tbody>
                    {/* START LOADER */}

                    {this.state.isLoding ? (
                      <tr className="text-center" style={{ padding: "20px" }}>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: "center" }}>
                          {" "}
                          <Loader
                            type="Puff"
                            color="#00BFFF"
                            height={100}
                            width={100}
                          />
                        </td>
                      </tr>
                    ) : this.state.conferenceEvents.length ? (
                      this.state.conferenceEvents.map((value, index) => (
                        <tr>
                          <td>{value.conference_name_abbr}</td>
                          <td>{value.conference_event_name_abbr}</td>
                          <td><a href = {value.conference_event_url}>{value.conference_event_url}</a></td>
                          <td>{value.no_of_stored_papers}</td>                         
                          <td className="text-center" style={{ width: "5"}}>
                            <Button color="secondary" onClick={() => this.collectEventPapers(value.conference_name_abbr, value.conference_event_name_abbr)} width = "50px">
                             Collect Publications
                            </Button>
                          </td >
                          <td className="text-center" style={{ width: "5"}}>
                            <Button color="secondary" onClick={() => this.ExtractEventTrends(value.conference_event_name_abbr)} width = "50px">
                            Extract Keywords/Topics
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                          <tr className="text-center1" style={{ padding: "20px" }}>
                            <td></td>
                            <td style={{ textAlign: "right" }}>
                              {" "}
                              <strong> No Events Found</strong>
                            </td>
                          </tr>
                        )}
                  </tbody>







                  </Table>
              
                  </ModalBody>

                  <ModalFooter>
                    <Button color="primary" onClick={this.eventstoggle}>
                      OK
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>







              {/* //  End Modal   */}

              {/* // Edit Start Modal */}
{/*               <div>
                <Modal isOpen={this.state.editmodal} toggle={this.edittoggle}>
                  <ModalHeader toggle={this.edittoggle}>
                    <strong>Edit Paper information</strong>
                  </ModalHeader>
                  <ModalBody>
                    <CardBody>
                      <Form>
                        <div className="pl-lg-4">
                          <Row>
                            <Col lg="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-username"
                                >
                                  Title
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  // defaultValue="lucky.jesse"
                                  type="text"
                                  id="input-username"
                                  name="title"
                                  defaultValue={this.state.title}
                                  value={this.state.title}
                                  onChange={this.handleChange}
                                  placeholder="Title"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-email"
                                >
                                  URL
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-email"
                                  name="url"
                                  defaultValue={this.state.url}
                                  onChange={this.handleChange}
                                  placeholder="https://www.zyz.com"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-first-name"
                                >
                                  Year
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  id="input-first-name"
                                  name="year"
                                  defaultValue={this.state.year}
                                  onChange={this.handleChange}
                                  placeholder="Year"
                                  type="number"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-last-name"
                                >
                                  Abstract
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  // defaultValue="Jesse"
                                  id="input-last-name"
                                  name="abstract"
                                  defaultValue={this.state.abstract}
                                  onChange={this.handleChange}
                                  placeholder="Abstract"
                                  type="textarea"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <Row>
                          <div>
                            <Button
                              color="primary"
                              type="button"
                              onClick={() => this.handleUpdate()}
                            // size="md"
                            >
                              Save 1
                        </Button>
                          </div>
                        </Row>
                        
                      </Form>
                    </CardBody>
                  </ModalBody>
                  <ModalFooter></ModalFooter>
                </Modal>
              </div> */}
              {/* // Edit End Modal   */}
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default viewConference;
