import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Label, Button, Icon, Image, Table, Modal } from "semantic-ui-react";
import _ from "underscore";
import { formatCurrency, formatNumber } from "../common/Utils";

export function ChooseAlternatePartModal(props) {

	const { metadataParts, part, onPartChosen, isOpen, trigger } = props;
	const [partModalOpen, setPartModalOpen] = useState(isOpen === true ? true : false);

	const handleOpenModal = (e) => {
    e.preventDefault();
		setPartModalOpen(true);
	};

	const handlePartModalClose = (e) => {
    setPartModalOpen(false);
  };

	const getMountingTypeById = (mountingTypeId) => {
    switch (mountingTypeId) {
      default:
      case 1:
        return "through hole";
      case 2:
        return "surface mount";
    }
  };

	const handleChooseAlternatePart = (e, part) => {
    e.preventDefault();
    onPartChosen(metadataParts, part);
    setPartModalOpen(false);
  };

	const handleTrigger = (e) => {
		e.preventDefault();
		setPartModalOpen(true);
	};

	const handleVisitLink = (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank");
  };

	const handleHighlightAndVisit = (e, url) => {
    handleVisitLink(e, url);
    // this handles highlighting of parent row
    const parentTable = ReactDOM.findDOMNode(e.target).parentNode.parentNode.parentNode;
    const targetNode = ReactDOM.findDOMNode(e.target).parentNode.parentNode;
    for (let i = 0; i < parentTable.rows.length; i++) {
      const row = parentTable.rows[i];
      if (row.classList.contains("positive")) row.classList.remove("positive");
    }
    targetNode.classList.toggle("positive");
  };

	const getColorBySource = (part) => {
		if (part.swarmPartNumberManufacturerId !== null)
			return "blue";
		return "grey";
	};

	const renderAllMatchingParts = (part, metadataParts) => {
    return (
      <Table compact celled selectable size="small" className="partstable">
        <Table.Header>
          <Table.Row>
						<Table.HeaderCell>Family</Table.HeaderCell>
            <Table.HeaderCell>Part</Table.HeaderCell>
            <Table.HeaderCell>Manufacturer</Table.HeaderCell>
            <Table.HeaderCell>Part Type</Table.HeaderCell>
            <Table.HeaderCell>Source</Table.HeaderCell>
            <Table.HeaderCell style={{width: '110px'}}>Package Type</Table.HeaderCell>
            <Table.HeaderCell>Mounting Type</Table.HeaderCell>
            <Table.HeaderCell>QTY Avail.</Table.HeaderCell>
            <Table.HeaderCell>Cost</Table.HeaderCell>
            <Table.HeaderCell>Image</Table.HeaderCell>
            <Table.HeaderCell style={{width: '170px'}}>Datasheet</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {metadataParts && metadataParts.map((p, index) => (
            <Table.Row key={index} onClick={(e) => handleChooseAlternatePart(e, p)}>
              <Table.Cell>
                {part.partNumber === p.basePartNumber ? (
                  <Label ribbon color={getColorBySource(p)}>{p.basePartNumber}</Label>
                ) : (
                  p.basePartNumber
                )}
              </Table.Cell>
							<Table.Cell>{p.manufacturerPartNumber}</Table.Cell>
              <Table.Cell>{p.manufacturer}</Table.Cell>
              <Table.Cell>{p.partType}</Table.Cell>
              <Table.Cell>{p.supplier}</Table.Cell>
              <Table.Cell>{p.packageType}</Table.Cell>
              <Table.Cell>{getMountingTypeById(p.mountingTypeId)}</Table.Cell>
              <Table.Cell>{formatNumber(p.quantityAvailable)}</Table.Cell>
              <Table.Cell>{formatCurrency(p.cost)}</Table.Cell>
              <Table.Cell>
                <Image src={p.imageUrl} size="mini"></Image>
              </Table.Cell>
              <Table.Cell>
                {p.datasheetUrls.map(
                  (d, dindex) =>
                    d &&
                    d.length > 0 && (
                      <p key={dindex}>
												<Button size="mini" title="View Datasheet" onClick={(e) => handleHighlightAndVisit(e, d)}>
													<Icon name="file pdf" />
													View Datasheet
												</Button>
											</p>
                    )
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  };

	const matchingPartsList = renderAllMatchingParts(part, metadataParts);

	const Trigger = () => {
		return (
			<div onClick={e => handleTrigger(e)}>{trigger}</div>
		);
	};

	return (<div>
	<Modal
		centered
		open={partModalOpen}
		onClose={handlePartModalClose}
	>
		<Modal.Header>Matching Parts</Modal.Header>
		<Modal.Content scrolling>
			<Modal.Description>{matchingPartsList}</Modal.Description>
		</Modal.Content>
	</Modal>
	{Trigger()}
</div>);
};