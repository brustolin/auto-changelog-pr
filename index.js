const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

const UpdateStatus = {
    UPDATED: "updated",
    NO_UPDATE: "noUpdate",
    NEEDS_UPDATE: "needsUpdate"
};

try {
    const changelogFile = core.getInput('changelog-file');
    console.log(`Opening ${changelogFile}`);

    const prNumber = getPrNumber();
    if (!prNumber) process.exit(1);

    const updateStatus = updateChangelog(changelogFile, prNumber);
    core.setOutput("did-update", updateStatus === UpdateStatus.UPDATED);

    switch (updateStatus) {
        case UpdateStatus.UPDATED:
            console.log(`✅ Changelog updated with PR number #${prNumber}`);
            break;
        case UpdateStatus.NO_UPDATE:
            console.log(`ℹ️ Changelog already contains PR number #${prNumber}`);
            break;
        case UpdateStatus.NEEDS_UPDATE:
        default:
            console.log(`⚠️ Placeholder <#PR> and PR number #${prNumber} not found in the changelog.`);
            if (core.getInput('fail-on-needs-update') === 'true') {
                core.setFailed("Placeholder and PR number not found.");
            }
            break;
    }
} catch (error) {
    core.setFailed(`🚨 Error: ${error.message}`);
}

function getPrNumber() {
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        core.setFailed('🚨 This action must be triggered by a pull request.');
        return null;
    }
    return pullRequest.number;
}

function updateChangelog(filePath, prNumber) {
    let content = fs.readFileSync(filePath, 'utf8');
    const prTag = `#${prNumber}`;

    if (content.includes(prTag)) {
        return UpdateStatus.NO_UPDATE;
    }

    if (content.includes('<#PR>')) {
        content = content.replace(/<#PR>/g, prTag);
        fs.writeFileSync(filePath, content, 'utf8');
        return UpdateStatus.UPDATED;
    }

    return UpdateStatus.NEEDS_UPDATE;
}