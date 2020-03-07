function fixDate(n: number) {
  if (n < 10) {
    return `0` + n
  }

  return n
}

export default fixDate
