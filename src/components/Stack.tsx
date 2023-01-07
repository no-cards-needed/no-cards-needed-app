export const Stack = ({
    stackType, 
    stackRef
}: {
    stackType: Stack["stackType"],
    stackRef: any
}) => {
    return (
        <div className={`cardDropZone ${stackType}`} ref={stackRef}>
        </div>
    )
}