import {makeProject} from '@revideo/core';
import '@fontsource/montserrat/latin-700.css';
import '@fontsource/montserrat/latin-800.css';
import '@fontsource/montserrat/latin-900.css';
import ad from './scenes/ad';
import {DEFAULT_CAMPAIGN, loadCampaign} from './lib/registry';

// Dimensions et fps viennent de la campagne par défaut (toutes les pubs sociales sont en 1080×1920, 30 fps).
// Pour une autre campagne en rendu : npm run render <id> ; dans l'éditeur : changer DEFAULT_CAMPAIGN.
const {width, height, fps} = loadCampaign(DEFAULT_CAMPAIGN).format;

export default makeProject({
  scenes: [ad],
  variables: {campaignId: DEFAULT_CAMPAIGN},
  settings: {
    shared: {size: {x: width, y: height}},
    rendering: {fps},
    preview: {fps},
  },
});
