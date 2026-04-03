const customErrors = (fieldName: string) => {
    const customMessage = {
        error: (iss: any) =>
            iss.input === undefined
                ? `${fieldName} is required`
                : `invalid input: require string but given ${typeof iss.input} in ${fieldName} field`,
    }
    return customMessage
}

module.exports = customErrors
