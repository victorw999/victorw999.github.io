const {readFile, writeFile} = require('fs').promises;
const got = require('got');

// use 'join' to include "/" or "\" in file paths depending on operating system
const {join} = require('path');
const README_PATH = join(__dirname, 'index.md');

const {SPACE_ID, AUTH_TOKEN} = process.env;

// Debug logs
console.log('Environment variables :');
console.log('SPACE_ID:', SPACE_ID ? 'Present' : 'Missing');
console.log('AUTH_TOKEN:', AUTH_TOKEN ? 'Present' : 'Missing');

/**
 * Fetch data from Contentful and return GraphQL data
 *
 * @return  {Promise<Array>}  [return description]
 */
async function fetchVicProjects() {
  try {
    const url = `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}`;
    console.log('Making request to:', url);

    const {body} = await got(
      url,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
             query victorProjectList{
                pageProjectListCollection(limit: 1){
                  items{
                    title
                    projectsCollection{
                      items{
                      ... on VictorProject {
                          title
                          slug
                          codeRepo
                          shortDescription
                          description {
                            json
                          }
                          demoGif {
                            title
                            fileName
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
          `,
        }),
      }
    );

    console.log('Response received successfully');
    const projects = JSON.parse(body).data.pageProjectListCollection.items[0].projectsCollection.items;
    return projects;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.body
    });
    throw error;
  }
}

/**
 * Update and replace the Contentful placeholders
 * of the passed readme with some real API data
 *
 * @param   {string}  readme  String of read README.md
 *
 * @return  {Promise<string>}          Updated README.md
 */
async function getUpdatedReadme(readme) {
  const projects = await fetchVicProjects();
  const contentfulDataRegex = /<!-- CONTENTFUL_START.*?CONTENTFUL_END -->/gs;

  return readme.replace(
    contentfulDataRegex,
    [
      '<!-- CONTENTFUL_START -->',
      ...projects.map(
        ({title, slug, description, codeRepo, shortDescription, demoGif}) =>
          `## [${title}](${codeRepo})\n${shortDescription}\n${convertRichTextToMarkdown(description.json)}\n![${demoGif.title}](${demoGif.url})
          `
      ),
      '<!-- CONTENTFUL_END -->',
    ].join('\n')
  );
}

/**
 * Convert the contentful's rich text json to markdown
 *
 * @param   {object}  json  The rich text object
 *
 * @return  {string}          The markdown string
 */
function convertRichTextToMarkdown(json) {
  const items = json.content;
  return items.map((item) => {
    if (item.nodeType === 'heading-3') {
      return `### ${item.content[0].value}`;
    } else if (item.nodeType === 'unordered-list') {
      const listItems = item.content;
      return listItems.map((listItem) => {
        if (listItem.nodeType === 'list-item') {
          const paragraph = listItem?.content[0]?.nodeType === 'paragraph' ? listItem.content[0] : '';

          const paragraphItems = paragraph?.content;
          const joinedParaItems = paragraphItems.map((paragraphItem) => {
            if (paragraphItem.nodeType === 'hyperlink') {
              const hyperlinkText = paragraphItem.content[0].value;
              const hyperlinkUrl = paragraphItem.data.uri;
              return `${hyperlinkText} (${hyperlinkUrl})`;
            }
            if (paragraphItem.nodeType === 'text') {
              return paragraphItem.value || '';
            }
          }).filter(Boolean).join(' ');
          return joinedParaItems ? `- ${joinedParaItems}` : '';
        }
      }).filter(Boolean).join('\n');
    }
  }).join('\n');
}

/**
 * @return  {Promise}
 */
async function main() {
  // read README.md
  const readme = await readFile(README_PATH, 'utf8');

  // do something with the readme
  const updatedReadme = await getUpdatedReadme(readme);

  // write README.md
  await writeFile(README_PATH, updatedReadme, 'utf8');
  console.log(`New readme written!`);
  console.log(updatedReadme);
}

main();
