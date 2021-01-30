import React, {useState} from 'react';
import {Button, Col, Container, OverlayTrigger, Popover, Row, Spinner, Image, Badge, Modal} from "react-bootstrap";
import {IconButton} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight, faTimes} from "@fortawesome/free-solid-svg-icons";
import RestAPI from "../../../services/api";
import HeatmapTweet from "../../ReuseableComponents/Charts/HeatMap/HeatMap.js";


export default function TweetCardRecommendation(props) {
  // Props
  const {userInterestModel, tweetText, score} = props;

  // Local constants
  const [openOverlay, setOpenOverlay] = useState(false);
  const [step, setStep] = useState(0);
  const [series, setSeries] = useState([]);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const [modal, setModal] = useState(false);
  const explanation = [
    "Intermediate explanation",
    "Advanced explanation"
  ];
  const description = [

    ' In this chart, you can see the  similarity score between your interests and keywords extracted from the tweet by hovering over the areas of the heatmap.' +
    ' On the X-axis we have the keywords extracted from the tweet, and on the Y-axis we have the interest profile'
    ,
    'In this figure, the inner logic of recommending this tweet is revealed.' +
    'The steps from extracting interests/Tweet keywords and their embedding representations to compute similarity between the two embedding models are illustrated:'
  ];

  // Functions
  // Opens the Overlay Popover and requests keywords from tweet
  const tweetInfo = () => {
    if (series.length === 0) {
      calculateSimilarity();
    }
    setOpenOverlay(!openOverlay);
    if (openOverlay) {
      setStep(0);
    }
  }
  // Step to the next level of explanation
  const handleStepForward = () => {
    setStep(step + 1);
  }
  // Step back to the previous level of explanation
  const handleStepBackward = () => {
    setStep(step - 1);
  }
  // Step out of the explanation
  const handleClose = () => {
    setOpenOverlay(!openOverlay);
    setTimeout(() => {
      if (error) {
        setCount(count + 1);
        setError("");
        setSeries([]);
      }
      setStep(0);
    }, 500);
  }

  const handleEnlargeImage = () => {
    setModal(!modal);
  }

  // REST API request for keywords from tweet and to compute similarity between tweet keywords
  const calculateSimilarity = async () => {
    const data = {
      text: tweetText.trim(),
      algorithm: "TopicRank"
    };
    const keywordArray = [];
    try {
      let response = await RestAPI.interestExtract(data);
      const keys = Object.keys(response.data);
      const value = Object.values(response.data);
      for (let i = 0; i < keys.length; i++) {
        keywordArray.push({
          text: keys[i],
          value: value[i],
        });
      }
    } catch (error) {
      setError("Loading error, close and try again.");
      console.log(error);
    }
    // Calling the REST API to compute similarity between tweet keywords
    let seriesData = [];
    if (keywordArray.length !== 0) {
      for (const userInterest of userInterestModel) {
        let data = [];
        for (const tweetKeyword of keywordArray) {
          let requestData = {
            keywords_1: [userInterest.text],
            keywords_2: [tweetKeyword.text],
            algorithm: "WordEmbedding"
          }
          try {
            let response = await RestAPI.computeSimilarity(requestData);
            data.push({
              x: tweetKeyword.text,
              y: response.data.score,
            });
          } catch (e) {
            setError("Loading error, close and try again.");
            console.log(error);
          }
        }
        seriesData.push({
          name: userInterest.text,
          data: data,
        });
      }
      setSeries(seriesData);
    }
  }

  return (
    <>
      <OverlayTrigger
        show={openOverlay}
        placement="bottom-end"
        overlay={
          <Popover style={{maxWidth: "600px", zIndex: 5}}>
            <Popover.Title>
              <Container>
                <Row className="align-items-center">
                  <Col style={{padding: "0px"}}>
                    <h2 style={{marginBottom: "0px"}}>
                      {explanation[step]}
                    </h2>
                  </Col>
                  <Col md="auto" style={{paddingRight: "0px"}}>
                    <h2 style={{marginBottom: "0px"}}>
                      <Badge pill variant="dark" style={{backgroundColor: "#f7f7f7"}}>Similarity: {score}%</Badge>
                    </h2>
                  </Col>
                  <Col md="auto" style={{paddingRight: "0px"}}>
                    <IconButton type="button" style={{width: "48px"}} onClick={handleClose}>
                      <FontAwesomeIcon icon={faTimes}/>
                    </IconButton>
                  </Col>
                </Row>
              </Container>
            </Popover.Title>
            <Popover.Content>
              <Container>
                <Row style={{marginBottom: "16px"}}>
                  <h4>
                    {description[step]}
                  </h4>
                </Row>
                <Row className="justify-content-center">
                  {(step === 0 && series.length !== 0) ? <HeatmapTweet series={series} width={'550'} height={'280'}/>
                    : (step === 1 ? (
                        <Row style={{marginBottom: "22px"}}>
                          <Col>
                            <Image src='/images/adv X.png' width={'570'}
                                   style={{cursor: "pointer"}} onClick={handleEnlargeImage}/>
                            <Modal show={modal} onHide={handleEnlargeImage} size={"lg"}>
                              <Modal.Header className="justify-content-end">
                                <IconButton type="button" style={{width: "48px"}} onClick={handleEnlargeImage}>
                                  <FontAwesomeIcon icon={faTimes}/>
                                </IconButton>
                              </Modal.Header>
                              <Modal.Body>
                                <Image fluid src='/images/adv X.png'/>
                              </Modal.Body>
                            </Modal>
                          </Col>
                        </Row>
                      ) : (error ?
                          <Button variant="link" disabled style={{fontSize: "16px", color: "red"}}>
                            {count >= 1 ? "Sorry, no data available for this tweet." : error}
                          </Button>
                          :
                          <Button variant="link" disabled style={{fontSize: "16px"}}>
                            <Spinner animation="border" role="status" size="sm"
                                     style={{margin: "0px 4px 3px 0px"}}/>
                            Loading...
                          </Button>
                      )
                    )
                  }
                </Row>
                <Row>
                  <Col style={{paddingLeft: "0px"}}>
                    {step > 0 ?
                      <Button variant="link" onClick={handleStepBackward} style={{fontSize: "16px"}}>
                        <FontAwesomeIcon icon={faAngleLeft} style={{marginRight: "4px"}}/> Less
                      </Button>
                      : <></>
                    }
                  </Col>
                  <Col md="auto" style={{paddingRight: "0px"}}>
                    {(step < 1 && series.length !== 0) ?
                      <Button variant="link" onClick={handleStepForward} style={{fontSize: "16px"}}>
                        More <FontAwesomeIcon icon={faAngleRight} style={{marginLeft: "4px"}}/>
                      </Button>
                      : <></>
                    }
                  </Col>
                </Row>
              </Container>
            </Popover.Content>
          </Popover>
        }
      >
        <Button variant="link" onClick={tweetInfo}>
          Why this tweet?
        </Button>
      </OverlayTrigger>
      {/* Modal to show the enlarged image of advanced explanation */}

    </>
  )
}