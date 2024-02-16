test("1+2=3, empty array is empty", () => {
  expect(1 + 2).toBe(3);
  expect([].length).toBe(0);
});

const SERVER_URL = "http://localhost:4000";

test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  const postNoteBody = await postNoteRes.json();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");
});

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
  // Clear the database before the test
  await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });

  const response = await fetch(`${SERVER_URL}/getAllNotes`);
  const data = await response.json();

  // Check that the HTTP status code is 200
  expect(response.status).toBe(200);

  // Expecting data.response to be an empty array
  expect(data.response).toEqual([]);
});

test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  // Clear the database before the test
  await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });

  await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: "First", content: "Content1" }),
  });

  // Add the second note
  await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: "Second", content: "Content2" }),
  });

  const response = await fetch(`${SERVER_URL}/getAllNotes`);
  const data = await response.json();

  // Check that the HTTP status code is 200
  expect(response.status).toBe(200);

  // Check that the response contains exactly two notes
  expect(data.response.length).toBe(2);
});

test("/deleteNote - Delete a note", async () => {
  // Step 1: Add a note
  let response = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Note to Delete",
      content: "Content of note to be deleted",
    }),
  });
  const noteToAdd = await response.json();
  expect(response.status).toBe(200);
  const noteId = noteToAdd.insertedId; // Assume the response includes the insertedId

  // Step 2: Delete the note
  response = await fetch(`${SERVER_URL}/deleteNote/${noteId}`, {
    method: "DELETE",
  });
  expect(response.status).toBe(200);
});

test("/patchNote - Patch with content and title", async () => {
  // Step 1: Add a note
  let response = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Original Title",
      content: "Original Content",
    }),
  });
  expect(response.status).toBe(200);
  const addNoteResponse = await response.json();
  const noteId = addNoteResponse.insertedId; // Assuming the response structure includes the insertedId

  // Step 2: Patch the note
  const updatedTitle = "Updated Title";
  const updatedContent = "Updated Content";
  response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
  });
  expect(response.status).toBe(200);
});

test("/patchNote - Patch with just title", async () => {
  // Step 1: Add a note
  let response = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Title for Patching",
      content: "Content shouldn't change",
    }),
  });
  const noteToAdd = await response.json();
  const noteId = noteToAdd.insertedId; // Adjust based on actual response structure

  // Step 2: Patch the note's title only
  const updatedTitle = "New Title After Patching";
  response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: updatedTitle }),
  });
  expect(response.status).toBe(200);
});

test("/patchNote - Patch with just content", async () => {
  // Step 1: Add a note
  let response = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Title Should Remain",
      content: "Original Content",
    }),
  });
  const noteToAdd = await response.json();
  const noteId = noteToAdd.insertedId; // Adjust based on actual response structure

  // Step 2: Patch the note's content only
  const updatedContent = "Updated Content Only";
  response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: updatedContent }),
  });
  expect(response.status).toBe(200);
});

test("/deleteAllNotes - Delete one note", async () => {
  // Add a single note
  await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: "Single Note", content: "To be deleted" }),
  });

  // Delete all notes
  const deleteResponse = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });
  expect(deleteResponse.status).toBe(200);

  // Verify deletion
  const getAllResponse = await fetch(`${SERVER_URL}/getAllNotes`);
  const getAllData = await getAllResponse.json();
  expect(getAllData.response.length).toBe(0);
});

test("/deleteAllNotes - Delete three notes", async () => {
  // Code here
  expect(false).toBe(true);
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  const postResponse = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Note for Color Update",
      content: "Color will change",
    }),
  });
  const postData = await postResponse.json();
  const noteId = postData.insertedId;

  // Update the note's color
  const patchResponse = await fetch(`${SERVER_URL}/updateNoteColor/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ color: "#FF0000" }),
  });
  expect(patchResponse.status).toBe(200);
});
