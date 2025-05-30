import { asString, z } from '../z.ts';

// TODO split up in separate schemas
export const jobResponseSchema = asString(z.enum([
  /*
    Temporary list to type mock responses.
    TODO @seferturan: update this list with all job titles.
  */
  'Casting Coordinator',
  'Producer',
  'Production Manager',
  'Co-Producer',
  'Associate Producer',
  'Local Casting',
  'Casting',
  'Casting Associate',
  'Costume Coordinator',
  'Key Makeup Artist',
  'Makeup Effects Designer',
  'Hair Department Head',
  'Special Effects Makeup Artist',
  'Key Hair Stylist',
  'Makeup Department Head',
  'Costume Design',
  'Costume Supervisor',
  'Prosthetic Designer',
  'Transportation Captain',
  'Thanks',
  'Post Production Supervisor',
  'Cast Driver',
  'Stunt Double',
  'Visual Effects Supervisor',
  'Visual Effects Producer',
  'Sound Effects Editor',
  'Production Sound Mixer',
  'Music Editor',
  'Foley Recordist',
  'Foley Editor',
  'Sound Designer',
  'Music Supervisor',
  'Music',
  'Sound Re-Recording Mixer',
  'Editor',
  'Production Design',
  'Graphic Designer',
  'Set Dresser',
  'Assistant Art Director',
  'Set Decoration',
  'Art Direction',
  'Property Master',
  'Construction Coordinator',
  'Title Designer',
  'Steadicam Operator',
  'Director of Photography',
  'Lighting Technician',
  'Executive Producer',
  'Co-Executive Producer',
  'Line Producer',
  'Supervising Sound Editor',
  'Dialogue Editor',
  'Foley Mixer',
  'Foley Artist',
  'Original Music Composer',
  'Supervising Art Director',
  'Special Effects Supervisor',
  'Hair Designer',
  'Makeup Designer',
  'Colorist',
  'Creator',
  'Stunts',

  //Directing jobs
  'Action Director',
  'Assistant Director',
  'Co-Director',
  'Continuity',
  'Crowd Assistant Director',
  'Director',
  'Field Director',
  'First Assistant Director',
  'Insert Unit Director',
  'Insert Unit First Assistant Director',
  'Layout',
  'Other',
  'Script Coordinator',
  'Script Supervisor',
  'Series Director',
  'Special Guest Director',
  'Stage Director',

  //Writing jobs
  'Adaptation',
  'Author',
  'Book',
  'Characters',
  'Co-Writer',
  'Comic Book',
  'Creative Producer',
  'Dialogue',
  'Executive Story Editor',
  'Graphic Novel',
  'Head of Story',
  'Idea',
  'Lyricist',
  'Musical',
  'Novel',
  'Opera',
  'Original Concept',
  'Original Film Writer',
  'Original Series Creator',
  'Original Story',
  'Scenario Writer',
  'Screenplay',
  'Screenstory',
  'Script Consultant',
  'Script Editor',
  'Senior Story Editor',
  'Series Composition',
  'Short Story',
  'Staff Writer',
  'Story',
  'Story Artist',
  'Story Consultant',
  'Story Coordinator',
  'Story Developer',
  'Story Editor',
  'Story Manager',
  'Story Supervisor',
  'Storyboard',
  'Teleplay',
  'Texte',
  'Theatre Play',
  'Writer',
  "Writers' Assistant",
  "Writers' Production",
]));
