const prepareMetadata = require("./metadataProcessing");
const loadLayersFromIPFS = require("./loadLayersFromIPFS");
const dotenv = require("dotenv");
dotenv.config();

/**
 * Prepare metadata for Tableland as SQL insert statements but in two tables ('main' and 'attributes').
 * @param {string} mainTable The name of the main metadata table in Tableland (id int, name text, description text, image text).
 * @param {string} attributesTable The name of the attributes table in Tableland (id int, layer_id int).
 * @param {string} layersTable The name of the layers table in Tableland (id int, trait_type text, value text, uri text).
 * @returns {{main: string, attributes: string[]}} SQL statements for metadata table writes.
 */
export async function prepareSql(
  mainTable: string | undefined,
  attributesTable: string | undefined,
  layersTable: string | undefined
) {
  // Prepare the metadata (handles all of the IPFS-related actions & JSON parsing).
  const metadata = await prepareMetadata();
  // An array to hold interpolated SQL INSERT statements, using the metadata object's values.
  const sqlInsertStatements = [];

  const layers = await loadLayersFromIPFS();

  for await (let obj of metadata) {
    // Destructure the metadata values from the passed object
    const { id, name, description, image, hash, attributes } = obj;
    // INSERT statement for a 'main' table that includes some shared data across any NFT
    // Schema: id int, name text, description text, image text
    let mainTableStatement = `INSERT INTO ${mainTable} (id, name, description, image, hash) VALUES (${id}, '${name}', '${description}', '${image}', '${hash}');`;
    // Iterate through the attributes and create an INSERT statment for each value, pushed to `attributesTableStatements`
    const attributesTableStatements = [];
    for await (let attribute of attributes) {
      // Get the attributes metadata;
      const { trait_type, value } = attribute;
      const layer_id = layers.findIndex(
        (x: any) => x.trait_type === trait_type && x.value === value
      );

      // INSERT statements for separate 'attributes' and `layers` tables that hold attribute data, keyed by the NFT tokenId
      // Attribute Schema: id int, layer_id int
      const attributesStatement = `INSERT INTO ${attributesTable} (main_id, layer_id) VALUES (${id},${+layer_id});`;
      attributesTableStatements.push(attributesStatement);
    }

    // Prepare the statements as a single 'statement' object
    const statement = {
      main: mainTableStatement,
      attributes: attributesTableStatements,
    };
    // Note the need above to stringify the attributes
    sqlInsertStatements.push(statement);
  }

  // Array to hold the statements for the `layers` table
  const layersStatements = [];

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const { id, trait_type, value, filename } = layer;

    // Construct the `layers` table INSERT statements
    // Layers Schema: id int primary key, trait_type text not null, value text, filename text
    const layersStatement = `INSERT INTO ${layersTable} (id, trait_type, value, uri) VALUES (${id},'${trait_type}', '${value}', '${filename}');`;
    layersStatements.push(layersStatement);
  }

  // Return the final prepared arrays of SQL INSERT statements
  return [sqlInsertStatements, layersStatements];
}
