import { expect, test } from '@playwright/test';

import { LINKED_EVENTS_URL } from '../../playwright.config';

test('Events', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/event`);
  expect(response.ok);
});

test('Events - Text search', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/event?text=jooga`);
  expect(response.ok);
});

test('Get Keywords', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/keyword`);
  expect(response.ok);
});

test('Get Keywords - Text search', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/keyword?text=lapset`);
  expect(response.ok);
});

test('Get Keyword Sets', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/keyword_set`);
  expect(response.ok);
});

test('Get Specific Keyword Set', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/keyword_set/helfi:topics`);
  expect(response.ok);
});

test('Get Places', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/place`);
  expect(response.ok);
});

test('Get Places - Text search', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/place?text=kirkko`);
  expect(response.ok);
});

test('Get Languages', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/language`);
  expect(response.ok);
});

test('Get Organisations', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/organization`);
  expect(response.ok);
});

test('Get Specific Organisation', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/organization/ahjo:00400`);
  expect(response.ok);
});

test('Get Images', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/image`);
  expect(response.ok);
});

test('Get Specific Image', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/image/91350`);
  expect(response.ok);
});

test('Search Events - Type event', async () => {
  const response = await fetch(`${LINKED_EVENTS_URL}/?type=event&q=sibelius`);
  expect(response.ok);
});

test('Search Events - Type place', async () => {
  const response = await fetch(
    `${LINKED_EVENTS_URL}/search/?type=place&input=kirkko`
  );
  expect(response.ok);
});

test('Search Events - Type event with start date', async () => {
  const response = await fetch(
    `${LINKED_EVENTS_URL}/search/?type=event&q=sibelius&start=2017-01-01`
  );
  expect(response.ok);
});
