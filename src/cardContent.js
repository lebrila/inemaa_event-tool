import React, {Component, PropTypes} from 'react';

// Styling
import { Label } from 'react-foundation-components/lib/label';
import { Button } from 'react-foundation-components/lib/button';
import { Reveal } from 'react-foundation-components/lib/reveal';
import { CloseButton } from 'react-foundation-components/lib/close-button';
import { ClearFix } from 'react-foundation-components/lib/float';
import 'font-awesome/scss/font-awesome.scss';

import * as detailPages from './detailPages';

class CardContent extends Component {

  state = {
    showDetail: false,
  };

  handleShowDetail = () => this.setState({showDetail: true});

  handleHideDetail = () => this.setState({showDetail: false});

  getListFormatMetaData() {
    const {
      distanceCenter,
      distanceStation,
    } = this.props.card.metadata;
    return (
      <div className="searchMetadata">
        {this.props.kind === 'location' &&
          <div>
            <div>Kapazität: {this.props.card.metadata.capacity}</div>
            <div>Konferenzräume: {this.props.card.metadata.conferenceRooms}</div>
          </div>
        }
        <ul className="distances">
          <li><span className="fa fa-dot-circle-o" /> {distanceCenter}</li>
          <li><span className="fa fa-train" /> {distanceStation}</li>
        </ul>
      </div>
    );
  }

  render() {
    const {
      card,
      kind
    } = this.props;

    const {
      showDetail,
    } = this.state;

    const dataAndButtonsExtraClass = kind === 'location' ? ' extraMetadata' : '';

    return (
      <ClearFix>
        <div className="resultTags">
          {card.tags.map(tag => <Label key={tag} color="primary">{tag}</Label>)}
        </div>
        <div className={`dataAndButtons${dataAndButtonsExtraClass}`}>
          {this.getListFormatMetaData()}
          <div className="resultButtons">
            <Button
              className="moreButton"
              color="secondary"
              size="small"
              onClick={() => {}}>
              <i className="fa fa-save"></i>
              merken
            </Button>
            <Button
              className="moreButton"
              color="secondary"
              size="small"
              onClick={this.handleShowDetail}>
              <span className="fa fa-info"></span>
              mehr ...
            </Button>
            <Reveal onHide={this.handleHideDetail} show={showDetail}>
              <CloseButton onClick={this.handleHideDetail} />
              <h1>{card.title} <small>{kind}</small></h1>
              <img role="presentation" src={detailPages[kind]} />
            </Reveal>
          </div>
          <ClearFix/>
        </div>
      </ClearFix>
    );
  }
}

CardContent.propTypes = {
  kind: PropTypes.string.isRequired,
  card: PropTypes.object.isRequired,
};

export default CardContent;
