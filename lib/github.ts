import { Octokit } from "@octokit/rest";

if (!process.env.GITHUB_ACCESS_TOKEN) {
  throw new Error('GITHUB_ACCESS_TOKEN is not set in environment variables');
}

if (!process.env.GITHUB_REPO_OWNER) {
  throw new Error('GITHUB_REPO_OWNER is not set in environment variables');
}

if (!process.env.GITHUB_REPO_NAME) {
  throw new Error('GITHUB_REPO_NAME is not set in environment variables');
}

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export async function inviteUserToRepo(email: string) {
  try {
    // First, get the user's GitHub ID by email
    const { data: users } = await octokit.search.users({
      q: `${email} in:email`,
    });

    if (users.items.length === 0) {
      throw new Error('GitHub account not found with this email');
    }

    const username = users.items[0].login;

    // Add collaborator to the repository
    await octokit.repos.addCollaborator({
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: process.env.GITHUB_REPO_NAME!,
      username,
      permission: 'pull', // Read-only access
    });

    return {
      success: true,
      repoUrl: `https://github.com/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}`,
    };
  } catch (error) {
    console.error('Error inviting user to repo:', error);
    throw error;
  }
}

export function getRepoUrl() {
  return `https://github.com/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}`;
} 