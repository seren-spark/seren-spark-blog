import { getCollection } from 'astro:content';
import {
  buildTagIndex,
  buildHomeData,
  groupEntriesByYear,
  sortJournalEntries,
  validateContentRelations,
} from './content-queries';

async function getSiteCollections() {
  const [allDocs, journal, projects] = await Promise.all([
    getCollection('docs'),
    getCollection('journal'),
    getCollection('projects'),
  ]);
  const docs = allDocs.filter((entry) => entry.id !== 'index');
  const collections = { docs, journal, projects };
  const issues = validateContentRelations(collections);

  if (issues.length > 0) {
    const details = issues
      .map(
        (issue) =>
          `${issue.sourceCollection}/${issue.sourceId}: ${issue.field} -> ${issue.targetId}`,
      )
      .join('\n');
    throw new Error(`发现无效的内容关联：\n${details}`);
  }

  return collections;
}

export async function getJournalEntries() {
  const { journal } = await getSiteCollections();
  return sortJournalEntries(journal);
}

export async function getJournalArchive() {
  return groupEntriesByYear(await getJournalEntries());
}

export async function getHomeData() {
  return buildHomeData(await getSiteCollections());
}

export async function getTagIndex() {
  return buildTagIndex(await getSiteCollections());
}

export async function getProjectEntries() {
  const { projects } = await getSiteCollections();
  return projects;
}
