let parseChecklist = plaintext => {
  return plaintext
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

}

export {parseChecklist}