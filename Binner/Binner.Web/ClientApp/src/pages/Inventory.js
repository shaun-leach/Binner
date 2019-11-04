import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'underscore';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Input, Label, Button, TextArea, Image, Form, Table, Segment, Popup, Modal, Dimmer, Loader } from 'semantic-ui-react';
import NumberPicker from '../components/NumberPicker';
import { ProjectColors } from '../common/Types';

const inlineStyle = {
  modal: {
    display: 'fixed !important',
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};

export class Inventory extends Component {
  static displayName = Inventory.name;
  static abortController = new AbortController();

  static propTypes = {
    partNumber: PropTypes.string
  };

  static defaultProps = {
    partNumber: ''
  };

  constructor(props) {
    super(props);
    const { partNumber } = props.match.params;
    this.searchDebounced = AwesomeDebouncePromise(this.fetchPartMetadata.bind(this), 500);
    const viewPreferences = JSON.parse(localStorage.getItem('viewPreferences')) || {
      helpDisabled:
        false,
      lastPartTypeId: 14, // IC
      lastMountingTypeId: 1, // Through Hole
      lastQuantity: 1,
      lastProjectId: null,
      lastLocation: '',
      lastBinNumber: '',
      lastBinNumber2: '',
      lowStockThreshold: 10,
    };
    console.log('partNumber', partNumber);
    this.state = {
      partNumber,
      recentParts: [],
      metadataParts: [],
      duplicateParts: [],
      viewPreferences,
      partModalOpen: false,
      duplicatePartModalOpen: false,
      part: {
        partId: 0,
        partNumber,
        allowPotentialDuplicate: false,
        quantity: viewPreferences.lastQuantity + '',
        lowStockThreshold: viewPreferences.lowStockThreshold + '',
        partTypeId: viewPreferences.lastPartTypeId || 14,
        mountingTypeId: viewPreferences.lastMountingTypeId || 1,
        packageType: '',
        keywords: '',
        description: '',
        datasheetUrl: '',
        digiKeyPartNumber: '',
        mouserPartNumber: '',
        location: viewPreferences.lastLocation || '',
        binNumber: viewPreferences.lastBinNumber || '',
        binNumber2: viewPreferences.lastBinNumber2 || '',
        cost: '',
        lowestCostSupplier: '',
        lowestCostSupplierUrl: '',
        productUrl: '',
        manufacturer: '',
        manufacturerPartNumber: '',
        imageUrl: '',
        projectId: viewPreferences.lastProjectId,
        supplier: '',
        supplierPartNumber: ''
      },
      partTypes: [],
      projects: [],
      mountingTypes: [
        {
          key: 999,
          value: null,
          text: '',
        },
        {
          key: 1,
          value: 1,
          text: 'Through Hole',
        },
        {
          key: 2,
          value: 2,
          text: 'Surface Mount',
        },
      ],
      loadingPartMetadata: false,
      loadingPartTypes: true,
      loadingProjects: true,
      loadingRecent: true,
      saveMessage: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRecentPartClick = this.handleRecentPartClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleForceSubmit = this.handleForceSubmit.bind(this);
    this.updateNumberPicker = this.updateNumberPicker.bind(this);
    this.disableHelp = this.disableHelp.bind(this);
    this.handleChooseAlternatePart = this.handleChooseAlternatePart.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleVisitLink = this.handleVisitLink.bind(this);
    this.handlePartModalClose = this.handlePartModalClose.bind(this);
    this.handleDuplicatePartModalClose = this.handleDuplicatePartModalClose.bind(this);
    this.handleHighlightAndVisit = this.handleHighlightAndVisit.bind(this);
  }

  async componentDidMount() {
    this.fetchPartTypes();
    this.fetchProjects();
    this.fetchRecentRows();
    if (this.state.partNumber) await this.fetchPart(this.state.partNumber);
  }

  async fetchPart(partNumber) {
    Inventory.abortController.abort(); // Cancel the previous request
    Inventory.abortController = new AbortController();
    this.setState({ loadingPartMetadata: true });
    try {
      const response = await fetch(`part?partNumber=${partNumber}`, {
        signal: Inventory.abortController.signal
      });
      const data = await response.json();
      this.setState({ part: data, loadingPartMetadata: false });
    } catch (ex) {
      if (ex.name === 'AbortError') {
        return; // Continuation logic has already been skipped, so return normally
      }
      throw ex;
    }
  }

  async fetchPartMetadata(input) {
    Inventory.abortController.abort(); // Cancel the previous request
    Inventory.abortController = new AbortController();
    const { part } = this.state;
    this.setState({ loadingPartMetadata: true });
    try {
      const response = await fetch(`part/info?partNumber=${input}&partType=${part.partType}&mountingType=${part.mountingType}`, {
        signal: Inventory.abortController.signal
      });
      const responseData = await response.json();
      if (responseData.requiresAuthentication) {
        // redirect for authentication
        window.open(responseData.redirectUrl, '_blank');
        return;
      }
      const { response: data } = responseData;
      let metadataParts = [];
      if (data && data.parts && data.parts.length > 0) {
        metadataParts = data.parts;
        const suggestedPart = data.parts[0];
        this.setPartFromMetadata(metadataParts, suggestedPart);
      }
      this.setState({ metadataParts, loadingPartMetadata: false });
    } catch (ex) {
      if (ex.name === 'AbortError') {
        return; // Continuation logic has already been skipped, so return normally
      }
      throw ex;
    }
  }

  async fetchRecentRows() {
    this.setState({ loadingRecent: true });
    const response = await fetch('part/list?orderBy=DateCreatedUtc&direction=Descending&results=10');
    const data = await response.json();
    this.setState({ recentParts: data, loadingRecent: false });
  }

  async fetchPartTypes() {
    this.setState({ loadingPartTypes: true });
    const response = await fetch('partType/list');
    const data = await response.json();
    const partTypes = _.sortBy(data.map((item) => {
      return {
        key: item.partTypeId,
        value: item.partTypeId,
        text: item.name,
      };
    }), 'text');
    this.setState({ partTypes, loadingPartTypes: false });
  }

  async fetchProjects() {
    this.setState({ loadingProjects: true });
    const response = await fetch('project/list?orderBy=DateCreatedUtc&direction=Descending&results=999');
    const data = await response.json();
    const projects = _.sortBy(data.map((item) => {
      return {
        key: item.projectId,
        value: item.projectId,
        text: item.name,
        label: { ...(_.find(ProjectColors, c => c.value == item.color).name !== '' && { color: _.find(ProjectColors, c => c.value == item.color).name }), circular: true, content: item.parts, size: 'tiny' },
      };
    }), 'text');
    this.setState({ projects, loadingProjects: false });
  }

  getMountingTypeById(mountingTypeId) {
    switch (mountingTypeId) {
      case 1:
        return 'through hole';
      case 2:
        return 'surface mount';
    }
  }

  /**
   * Force a save of a possible duplicate part
   * @param {any} e
   */
  handleForceSubmit(e) {
    const { part } = this.state;
    part.allowPotentialDuplicate = true;
    this.setState({
      duplicatePartModalOpen: false,
      part
    });
    this.onSubmit(e);
  }

  /**
   * Save the part
   * 
   * @param {any} e
   */
  async onSubmit(e) {
    const { part, viewPreferences } = this.state;
    const isExisting = part.partId > 0;
    part.partTypeId = part.partTypeId + '';
    part.mountingTypeId = part.mountingTypeId + '';
    part.quantity = Number.parseInt(part.quantity) || 0;
    part.lowStockThreshold = Number.parseInt(part.lowStockThreshold) || 0;
    part.cost = Number.parseFloat(part.cost) || 0.00;
    part.projectId = Number.parseInt(part.projectId) || null;

    const saveMethod = isExisting ? 'PUT' : 'POST';
    const response = await fetch('part', {
      method: saveMethod,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(part)
    });

    let saveMessage = '';
    if (response.status === 409) {
      // possible duplicate
      const data = await response.json();
      this.setState({ duplicateParts: data.parts, duplicatePartModalOpen: true });
    } else if (response.status === 200) {
      // reset form if it was a new part
      if (isExisting) {
        saveMessage = `Saved part ${part.partNumber}!`;
        this.setState({ saveMessage });
      } else {
        saveMessage = `Added part ${part.partNumber}!`;
        this.setState({
          saveMessage,
          part: {
            allowPotentialDuplicate: false,
            partId: 0,
            partNumber: '',
            quantity: viewPreferences.lastQuantity + '',
            lowStockThreshold: viewPreferences.lowStockThreshold + '',
            partTypeId: viewPreferences.lastPartTypeId,
            mountingTypeId: viewPreferences.lastMountingTypeId,
            packageType: '',
            keywords: '',
            description: '',
            datasheetUrl: '',
            digiKeyPartNumber: '',
            mouserPartNumber: '',
            location: viewPreferences.lastLocation,
            binNumber: viewPreferences.lastBinNumber,
            binNumber2: viewPreferences.lastBinNumber2,
            cost: '',
            lowestCostSupplier: '',
            lowestCostSupplierUrl: '',
            productUrl: '',
            manufacturer: '',
            manufacturerPartNumber: '',
            imageUrl: '',
            projectId: viewPreferences.lastProjectId,
            supplier: '',
            supplierPartNumber: '',
          },
        });
      }
      // refresh recent parts list
      await this.fetchRecentRows();
    }

  }

  updateNumberPicker(e) {
    const { part, viewPreferences } = this.state;
    part.quantity = e.value + '';
    localStorage.setItem('viewPreferences', JSON.stringify({ ...viewPreferences, lastQuantity: e.value }));
    this.setState({ part });
  }

  handleChange(e, control) {
    const { part, viewPreferences } = this.state;
    part[control.name] = control.value;
    switch (control.name) {
      case 'partNumber':
        if (part.partNumber && part.partNumber.length > 0)
          this.searchDebounced(part.partNumber);
        break;
      case 'partTypeId':
        localStorage.setItem('viewPreferences', JSON.stringify({ ...viewPreferences, lastPartTypeId: control.value }));
        if (part.partNumber && part.partNumber.length > 0)
          this.searchDebounced(part.partNumber);
        break;
      case 'mountingTypeId':
        localStorage.setItem('viewPreferences', JSON.stringify({ ...viewPreferences, lastMountingTypeId: control.value }));
        if (part.partNumber && part.partNumber.length > 0)
          this.searchDebounced(part.partNumber);
        break;
      case 'lowStockThreshold':
        localStorage.setItem('viewPreferences', JSON.stringify({ ...viewPreferences, lowStockThreshold: control.value }));
        break;
      case 'projectId':
        localStorage.setItem('viewPreferences', JSON.stringify({ ...viewPreferences, lastProjectId: control.value }));
        break;
      case 'location':
        localStorage.setItem('viewPreferences', JSON.stringify({ ...viewPreferences, lastLocation: control.value }));
        break;
      case 'binNumber':
        localStorage.setItem('viewPreferences', JSON.stringify({ ...viewPreferences, lastBinNumber: control.value }));
        break;
      case 'binNumber2':
        localStorage.setItem('viewPreferences', JSON.stringify({ ...viewPreferences, lastBinNumber2: control.value }));
        break;
    }
    this.setState({ part });
  }

  setPartFromMetadata(metadataParts, suggestedPart) {
    const { part } = this.state;
    const mappedPart = {
      partNumber: suggestedPart.partNumber,
      partTypeId: suggestedPart.partTypeId,
      mountingTypeId: suggestedPart.mountingTypeId,
      packageType: suggestedPart.packageType,
      keywords: suggestedPart.keywords && suggestedPart.keywords.join(' ').toLowerCase(),
      description: suggestedPart.description,
      datasheetUrls: suggestedPart.datasheetUrls,
      supplier: suggestedPart.supplier,
      supplierPartNumber: suggestedPart.supplierPartNumber,
      cost: suggestedPart.cost,
      productUrl: suggestedPart.productUrl,
      manufacturer: suggestedPart.manufacturer,
      manufacturerPartNumber: suggestedPart.manufacturerPartNumber,
      imageUrl: suggestedPart.imageUrl,
      status: suggestedPart.status,
    };
    part.supplier = mappedPart.supplier;
    part.supplierPartNumber = mappedPart.supplierPartNumber;
    if (mappedPart.partTypeId)
      part.partTypeId = mappedPart.partTypeId || '';
    if (mappedPart.mountingTypeId)
      part.mountingTypeId = mappedPart.mountingTypeId || '';
    part.packageType = mappedPart.packageType || '';
    part.keywords = mappedPart.keywords || '';
    part.description = mappedPart.description || '';
    part.manufacturer = mappedPart.manufacturer || '';
    part.manufacturerPartNumber = mappedPart.manufacturerPartNumber || '';
    part.productUrl = mappedPart.productUrl || '';
    part.imageUrl = mappedPart.imageUrl || '';
    if (mappedPart.datasheetUrls.length > 0) {
      part.datasheetUrl = _.first(mappedPart.datasheetUrls) || '';
    }
    if (mappedPart.supplier === 'DigiKey') {
      part.digiKeyPartNumber = mappedPart.supplierPartNumber || '';
      const searchResult = _.find(metadataParts, e => { return e !== undefined && e.supplier === 'Mouser' && e.manufacturerPartNumber === mappedPart.manufacturerPartNumber });
      if (searchResult) {
        part.mouserPartNumber = searchResult.supplierPartNumber;
        if (part.packageType.length === 0) part.packageType = searchResult.packageType;
        if (part.datasheetUrl.length === 0) part.datasheetUrl = _.first(searchResult.datasheetUrls) || '';
        if (part.imageUrl.length === 0) part.imageUrl = searchResult.imageUrl;
      }
    }
    if (mappedPart.supplier === 'Mouser') {
      part.mouserPartNumber = mappedPart.supplierPartNumber || '';
      const searchResult = _.find(metadataParts, e => { return e !== undefined && e.supplier === 'DigiKey' && e.manufacturerPartNumber === mappedPart.manufacturerPartNumber });
      if (searchResult) {
        part.digiKeyPartNumber = searchResult.supplierPartNumber;
        if (part.packageType.length === 0) part.packageType = searchResult.packageType;
        if (part.datasheetUrl.length === 0) part.datasheetUrl = _.first(searchResult.datasheetUrls) || '';
        if (part.imageUrl.length === 0) part.imageUrl = searchResult.imageUrl;
      }
    }

    const lowestCostPart = _.first(_.sortBy(_.filter(metadataParts, (i) => i.cost > 0), 'cost'));

    part.cost = lowestCostPart.cost;
    part.lowestCostSupplier = lowestCostPart.supplier;
    part.lowestCostSupplierUrl = lowestCostPart.productUrl;
    this.setState({ part });
  }

  handleChooseAlternatePart(e, part) {
    e.preventDefault();
    const { metadataParts } = this.state;
    this.setPartFromMetadata(metadataParts, part);
    this.setState({ partModalOpen: false });
  }

  handleOpenModal(e) {
    e.preventDefault();
    this.setState({ partModalOpen: true });
  }

  renderAllMatchingParts(part, metadataParts) {
    return (
      <Table compact celled selectable size='small' className='partstable'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Part</Table.HeaderCell>
            <Table.HeaderCell>Manufacturer</Table.HeaderCell>
            <Table.HeaderCell>Part Type</Table.HeaderCell>
            <Table.HeaderCell>Supplier</Table.HeaderCell>
            <Table.HeaderCell>Supplier Part</Table.HeaderCell>
            <Table.HeaderCell>Package Type</Table.HeaderCell>
            <Table.HeaderCell>Mounting Type</Table.HeaderCell>
            <Table.HeaderCell>Cost</Table.HeaderCell>
            <Table.HeaderCell>Image</Table.HeaderCell>
            <Table.HeaderCell>Datasheet</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {metadataParts.map((p, index) =>
            <Table.Row key={index} onClick={e => this.handleChooseAlternatePart(e, p)}>
              <Table.Cell>
                {part.supplier === p.supplier && part.supplierPartNumber === p.supplierPartNumber ?
                  <Label ribbon>{p.manufacturerPartNumber}</Label>
                  : p.manufacturerPartNumber}
              </Table.Cell>
              <Table.Cell>{p.manufacturer}</Table.Cell>
              <Table.Cell>{p.partType}</Table.Cell>
              <Table.Cell>{p.supplier}</Table.Cell>
              <Table.Cell>{p.supplierPartNumber}</Table.Cell>
              <Table.Cell>{p.packageType}</Table.Cell>
              <Table.Cell>{this.getMountingTypeById(p.mountingTypeId)}</Table.Cell>
              <Table.Cell>{p.cost}</Table.Cell>
              <Table.Cell><Image src={p.imageUrl} size='mini'></Image></Table.Cell>
              <Table.Cell>{p.datasheetUrls.map((d, dindex) =>
                <a href='#' key={dindex} onClick={e => this.handleHighlightAndVisit(e, d)}>View Datasheet</a>
              )}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }

  renderDuplicateParts() {
    const { duplicateParts } = this.state;
    return (
      <Table compact celled selectable size='small' className='partstable'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Part Number</Table.HeaderCell>
            <Table.HeaderCell>Manufacturer Part</Table.HeaderCell>
            <Table.HeaderCell>Manufacturer</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Part Type</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Bin Number</Table.HeaderCell>
            <Table.HeaderCell>Bin Number 2</Table.HeaderCell>
            <Table.HeaderCell>Mounting Type</Table.HeaderCell>
            <Table.HeaderCell>Image</Table.HeaderCell>
            <Table.HeaderCell>Datasheet</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {duplicateParts.map((p, index) =>
            <Table.Row key={index}>
              <Table.Cell>{p.partNumber}</Table.Cell>
              <Table.Cell>{p.manufacturerPartNumber}</Table.Cell>
              <Table.Cell>{p.manufacturer}</Table.Cell>
              <Table.Cell>{p.description}</Table.Cell>
              <Table.Cell>{p.partType}</Table.Cell>
              <Table.Cell>{p.location}</Table.Cell>
              <Table.Cell>{p.binNumber}</Table.Cell>
              <Table.Cell>{p.binNumber2}</Table.Cell>
              <Table.Cell>{this.getMountingTypeById(p.mountingTypeId)}</Table.Cell>
              <Table.Cell><Image src={p.imageUrl} size='mini'></Image></Table.Cell>
              <Table.Cell><a href='#' onClick={e => this.handleHighlightAndVisit(e, p.datasheetUrl)}>View Datasheet</a></Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }

  handlePartModalClose() {
    this.setState({ partModalOpen: false });
  }

  handleDuplicatePartModalClose() {
    this.setState({ duplicatePartModalOpen: false });
  }

  disableHelp() {
    const { viewPreferences } = this.state;
    const val = { ...viewPreferences, helpDisabled: true };
    // localStorage.setItem('viewPreferences', JSON.stringify(val));
  }

  handleHighlightAndVisit(e, url) {
    this.handleVisitLink(e, url);
    // this handles highlighting of parent row
    const parentTable = ReactDOM.findDOMNode(e.target).parentNode.parentNode.parentNode;
    const targetNode = ReactDOM.findDOMNode(e.target).parentNode.parentNode;
    for (let i = 0; i < parentTable.rows.length; i++) {
      const row = parentTable.rows[i];
      if (row.classList.contains('positive')) row.classList.remove('positive');
    }
    targetNode.classList.toggle('positive');
  }

  handleVisitLink(e, url) {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank');
  }

  async handleRecentPartClick(e, part) {
    this.setState({ partNumber: part.partNumber, part });
    this.props.history.push(`/inventory/${part.partNumber}`);
    await this.fetchPart(part.partNumber);
  }

  renderRecentParts(recentParts) {
    return (
      <Table compact celled selectable striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Part</Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell>Part Type</Table.HeaderCell>
            <Table.HeaderCell>Manufacturer Part</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Bin Number</Table.HeaderCell>
            <Table.HeaderCell>Bin Number 2</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {recentParts.map((p, index) =>
            <Table.Row key={index} onClick={e => this.handleRecentPartClick(e, p)}>
              <Table.Cell>
                {index === 0 ?
                  <Label ribbon>{p.partNumber}</Label>
                  : p.partNumber}
              </Table.Cell>
              <Table.Cell>{p.quantity}</Table.Cell>
              <Table.Cell>{p.partType}</Table.Cell>
              <Table.Cell>{p.manufacturerPartNumber}</Table.Cell>
              <Table.Cell>{p.location}</Table.Cell>
              <Table.Cell>{p.binNumber}</Table.Cell>
              <Table.Cell>{p.binNumber2}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }

  render() {
    const { part,
      recentParts, metadataParts, partTypes, mountingTypes, projects, viewPreferences, partModalOpen, duplicatePartModalOpen,
      loadingPartMetadata, loadingPartTypes, loadingProjects, loadingRecent, saveMessage
    } = this.state;
    const matchingPartsList = this.renderAllMatchingParts(part, metadataParts);
    const title = this.props.match.params.partNumber ? 'Edit Inventory' : 'Add Inventory';
    return (
      <div>
        <Modal centered
          open={duplicatePartModalOpen}
          onClose={this.handleDuplicatePartModalClose}
        >
          <Modal.Header>Duplicate Part</Modal.Header>
          <Modal.Content scrolling>
            <Modal.Description>
              <h3>There is a possible duplicate part already in your inventory.</h3>
              {this.renderDuplicateParts()}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleDuplicatePartModalClose}>Cancel</Button>
            <Button primary onClick={this.handleForceSubmit}>Save Anyways</Button>
          </Modal.Actions>
        </Modal>
        <Form onSubmit={this.onSubmit}>
          <h1>{title}</h1>
          <Form.Group>
            <Form.Input label='Part' required placeholder='LM358' icon='search' focus value={part.partNumber || ''} onChange={this.handleChange} name='partNumber' />
            <Form.Dropdown label='Part Type' placeholder='Part Type' loading={loadingPartTypes} search selection value={part.partTypeId || ''} options={partTypes} onChange={this.handleChange} name='partTypeId' />
            <Form.Dropdown label='Mounting Type' placeholder='Mounting Type' search selection value={part.mountingTypeId || ''} options={mountingTypes} onChange={this.handleChange} name='mountingTypeId' />
            <Form.Dropdown label='Project' placeholder='My Project' loading={loadingProjects} search selection value={part.projectId || ''} options={projects} onChange={this.handleChange} name='projectId' />
          </Form.Group>
          <Form.Group>
            <Popup hideOnScroll disabled={viewPreferences.helpDisabled} onOpen={this.disableHelp} content='Use the mousewheel and CTRL/ALT to change step size' trigger={<Form.Field control={NumberPicker} label='Quantity' placeholder='10' min={0} value={part.quantity || ''} onChange={this.updateNumberPicker} name='quantity' autoComplete='off' />} />
            <Popup hideOnScroll disabled={viewPreferences.helpDisabled} onOpen={this.disableHelp} content='A custom value for identifying the parts location' trigger={<Form.Input label='Location' placeholder='Home lab' value={part.location || ''} onChange={this.handleChange} name='location' />} />
            <Popup hideOnScroll disabled={viewPreferences.helpDisabled} onOpen={this.disableHelp} content='A custom value for identifying the parts location' trigger={<Form.Input label='Bin Number' placeholder='IC Components 2' value={part.binNumber || ''} onChange={this.handleChange} name='binNumber' />} />
            <Popup hideOnScroll disabled={viewPreferences.helpDisabled} onOpen={this.disableHelp} content='A custom value for identifying the parts location' trigger={<Form.Input label='Bin Number 2' placeholder='14' value={part.binNumber2 || ''} onChange={this.handleChange} name='binNumber2' />} />
            <Popup hideOnScroll disabled={viewPreferences.helpDisabled} onOpen={this.disableHelp} content='Alert when the quantity gets below this value' trigger={<Form.Input label='Low Stock' placeholder='10' value={part.lowStockThreshold || ''} onChange={this.handleChange} name='lowStockThreshold' width={3} />} />
          </Form.Group>
          <Form.Field inline>
            <Button type='submit'>Save</Button>
            {saveMessage.length > 0 && <Label pointing='left'>{saveMessage}</Label>}
          </Form.Field>
          <Segment loading={loadingPartMetadata}>
            {metadataParts.length > 0 &&
              <Modal centered
                trigger={<a href="#" onClick={this.handleOpenModal}>Choose alternate part</a>}
                open={partModalOpen}
                onClose={this.handlePartModalClose}
              >
                <Modal.Header>Matching Parts</Modal.Header>
                <Modal.Content scrolling>
                  <Modal.Description>
                    {matchingPartsList}
                  </Modal.Description>
                </Modal.Content>
              </Modal>
            }
            <Form.Group>
              <Form.Field width={4}>
                <label>Cost</label>
                <Input label='$' placeholder='0.000' value={part.cost || ''} type='text' onChange={this.handleChange} name='cost' />
              </Form.Field>
              <Form.Input label='Manufacturer' placeholder='Texas Instruments' value={part.manufacturer || ''} onChange={this.handleChange} name='manufacturer' width={4} />
              <Form.Input label='Manufacturer Part' placeholder='LM358' value={part.manufacturerPartNumber || ''} onChange={this.handleChange} name='manufacturerPartNumber' />
              <Image src={part.imageUrl} size='tiny' />
            </Form.Group>
            <Form.Field width={10}>
              <label>Keywords</label>
              <Input icon='tags' iconPosition='left' label={{ tag: true, content: 'Add Keyword' }} labelPosition='right' placeholder='op amp' onChange={this.handleChange} value={part.keywords || ''} name='keywords' />
            </Form.Field>
            <Form.Field width={4}>
              <label>Package Type</label>
              <Input placeholder='DIP8' value={part.packageType || ''} onChange={this.handleChange} name='packageType' />
            </Form.Field>
            <Form.Field width={10} control={TextArea} label='Description' value={part.description || ''} onChange={this.handleChange} name='description' />
            <Form.Field width={10}>
              <label>Datasheet Url</label>
              <Input action className='labeled' placeholder='www.ti.com/lit/ds/symlink/lm2904-n.pdf' value={(part.datasheetUrl || '').replace('http://', '').replace('https://', '')} onChange={this.handleChange} name='datasheetUrl'>
                <Label>http://</Label>
                <input />
                <Button onClick={e => this.handleVisitLink(e, part.datasheetUrl)} disabled={!part.datasheetUrl || part.datasheetUrl.length === 0}>View</Button>
              </Input>
            </Form.Field>
            <Form.Field width={10}>
              <label>Product Url</label>
              <Input action className='labeled' placeholder='' value={(part.productUrl || '').replace('http://', '').replace('https://', '')} onChange={this.handleChange} name='productUrl'>
                <Label>http://</Label>
                <input />
                <Button onClick={e => this.handleVisitLink(e, part.productUrl)} disabled={!part.productUrl || part.productUrl.length === 0}>Visit</Button>
              </Input>
            </Form.Field>
            <Form.Field width={4}>
              <label>Lowest Cost Supplier</label>
              <Input placeholder='DigiKey' value={part.lowestCostSupplier || ''} onChange={this.handleChange} name='lowestCostSupplier' />
            </Form.Field>
            <Form.Field width={10}>
              <label>Lowest Cost Supplier Url</label>
              <Input action className='labeled' placeholder='' value={(part.lowestCostSupplierUrl || '').replace('http://', '').replace('https://', '')} onChange={this.handleChange} name='lowestCostSupplierUrl'>
                <Label>http://</Label>
                <input />
                <Button onClick={e => this.handleVisitLink(e, part.lowestCostSupplierUrl)} disabled={!part.lowestCostSupplierUrl || part.lowestCostSupplierUrl.length === 0}>Visit</Button>
              </Input>
            </Form.Field>
            <Form.Field width={4}>
              <label>DigiKey Part Number</label>
              <Input placeholder='296-1395-5-ND' value={part.digiKeyPartNumber || ''} onChange={this.handleChange} name='digiKeyPartNumber' />
            </Form.Field>
            <Form.Field width={4}>
              <label>Mouser Part Number</label>
              <Input placeholder='595-LM358AP' value={part.mouserPartNumber || ''} onChange={this.handleChange} name='mouserPartNumber' />
            </Form.Field>
          </Segment>
        </Form>
        <br />
        <h4>Recently added parts</h4>
        <div style={{ marginTop: '20px' }}>
          <Segment style={{ minHeight: '50px' }}>
            <Dimmer active={loadingRecent} inverted>
              <Loader inverted />
            </Dimmer>
            {!loadingRecent && recentParts && this.renderRecentParts(recentParts)}
          </Segment>
        </div>
      </div>
    );
  }
}