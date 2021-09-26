// @see https://github.com/release-it/release-it/blob/master/config/release-it.json
module.exports = {
  "git": {
    "changelog": "git log --pretty=format:\"* %s (%h)\" ${latestTag}...HEAD",
    "requireCleanWorkingDir": false,
    "requireUpstream": false,
    "requireCommits": true,
    "addUntrackedFiles": false,
    "commit": true,
    "commitMessage": "Release v${version}",
    "commitArgs": "",
    "tag": true,
    "tagName": "${version}",
    "tagAnnotation": "Release v${version}",
    "tagArgs": "",
    "push": true,
    "pushArgs": "--follow-tags",
    "pushRepo": "origin"
  },
  //@see https://github.com/release-it/release-it/blob/master/docs/git.md
  gitlab: {
    release: true,
    releaseName: "Release ${version}",
    // releaseNotes: null,
    // tokenRef: "GITLAB_TOKEN",
    // tokenHeader: "GITLAB_TOKEN",
    // certificateAuthorityFile: null,
    // assets: null,
    origin: 'http://git.alltuu.ren',
    // skipChecks: false
  },
  hooks: {
    // "before:init": ["npm run lint", "npm test"],
    'after:bump': ['npm run build'],
  },
  npm: {
    publish: true,
    "skipChecks": true
  },
}
