const customErrors = (fieldName: string) => {
    const customMessage = {
        error: (iss: any) =>
            iss.input === undefined
                ? `${fieldName} is required`
                : `invalid input: require ${iss.expected} but given ${typeof iss.input} in ${fieldName} field`,
    }
    return customMessage
}

module.exports = customErrors
