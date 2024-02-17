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
  const noteId = noteToAdd.insertedId;

  // Step 2: Delete the note
  const deleteResponse = await fetch(`${SERVER_URL}/deleteNote/${noteId}`, {
    method: "DELETE",
  });
  const deleteResponseBody = await deleteResponse.json();

  expect(deleteResponse.status).toBe(200);

  expect(deleteResponseBody.response).toBe(
    `Document with ID ${noteId} deleted.`
  );
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
  const addNoteResponse = await response.json();
  const noteId = addNoteResponse.insertedId;

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

  const patchBody = await response.json();

  expect(response.status).toBe(200);
  expect(patchBody.response).toBe(`Document with ID ${noteId} patched.`);
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
  const noteId = noteToAdd.insertedId;

  // Step 2: Patch the note's title only
  const updatedTitle = "New Title After Patching";
  response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: updatedTitle }),
  });
  const patchBody = await response.json();

  expect(response.status).toBe(200);
  expect(patchBody.response).toBe(`Document with ID ${noteId} patched.`);
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
  const noteId = noteToAdd.insertedId;

  // Step 2: Patch the note's content only
  const updatedContent = "Updated Content Only";
  response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: updatedContent }),
  });
  const patchBody = await response.json();

  expect(response.status).toBe(200);
  expect(patchBody.response).toBe(`Document with ID ${noteId} patched.`);
});

test("/deleteAllNotes - Delete one note", async () => {
  // Clear the database before the test
  await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });

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

  const deleteBody = await deleteResponse.json();
  expect(deleteResponse.status).toBe(200);

  expect(deleteBody.response).toBe(`1 note(s) deleted.`);
});

test("/deleteAllNotes - Delete three notes", async () => {
  // Clear the database before the test
  await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });

  // Add three notes
  for (let i = 1; i <= 3; i++) {
    await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `Note ${i}`,
        content: `Content for note ${i}`,
      }),
    });
  }
  // Delete all notes
  const deleteResponse = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });
  const deleteBody = await deleteResponse.json();
  expect(deleteResponse.status).toBe(200);

  // Verify that the response indicates three notes were deleted
  expect(deleteBody.response).toBe(`3 note(s) deleted.`);
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  // Step 1: Add a note
  let response = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Note to Update Color",
      content: "Content of the note whose color will be updated",
    }),
  });
  const noteToAdd = await response.json();
  const noteId = noteToAdd.insertedId;

  // Step 2: Update the note's color
  response = await fetch(`${SERVER_URL}/updateNoteColor/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ color: "#FF0000" }),
  });
  expect(response.status).toBe(200);
  const updateColorBody = await response.json();

  expect(updateColorBody.message).toBe("Note color updated successfully.");
});
