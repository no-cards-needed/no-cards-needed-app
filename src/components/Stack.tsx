export const Stack = ({stackType, stackRef}) => {
    return (
        <div className={`cardDropZone ${stackType}`} ref={stackRef}>
        </div>
    )
}