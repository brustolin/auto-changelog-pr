const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require("path");

const UpdateStatus = {
    UPDATED: "updated",
    NO_UPDATE: "noUpdate",
    NEEDS_UPDATE: "needsUpdate"
};

async function main() {
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
                if (core.getInput('auto-commit') == 'true') {
                    await commit();
                    console.log(`✅ Changes were committed back to the branch.`);
                } else {
                    console.log(`⚠️ Changes were not committed back to the branch.`);
                }
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

async function commit() {
    const headRef = github.context.payload.pull_request?.head.ref;
    await exec('bash', [path.join(__dirname, "./commit.sh", ), headRef]);
}

function exec(cmd, args = []) {
    return new Promise((resolve, reject) => {
        const app = spawn(cmd, args, { stdio: 'inherit' });
        app.on('close', code => {
            if (code !== 0) {
                err = new Error(`Invalid status code: ${code}`);
                err.code = code;
                return reject(err);
            };
            return resolve(code);
        });
        app.on('error', reject);
    });
}

main()