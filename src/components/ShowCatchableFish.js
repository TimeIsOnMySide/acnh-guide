import { useDispatch, useSelector } from 'react-redux'
import { getAllFish } from '../features/fish/fishSlice'
import { useEffect } from 'react'

// Notes for what to work on when API starts working again:
//

const ShowCatchableFish = () => {
    const { allFish, isLoading } = useSelector((state) => state.fish)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllFish())
    }, [dispatch])

    if (isLoading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }

    //
    // Find catchable fish logic
    //
    const catchableFish = [] // This is where ill push the catchable fish after evaluating the current time
    let fishNameArr = [] // These are all the first level object keys of the objects I need to check
    for (const fish in allFish) {
        fishNameArr.push(fish)
    }

    // //check for daylight saving time
    function hasDST(date = new Date()) {
        const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset()
        const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset()

        return Math.max(january, july) !== date.getTimezoneOffset()
    }

    //Get current date:
    const date = new Date()
    //Get current month (add 1 because array is 0-11)
    const currentMonth = date.getMonth() + 1
    //Get current hour, check for daylight savings
    let currentHour
    if (hasDST(date)) {
        currentHour = date.getHours()
    } else {
        currentHour = date.getHours() + 1
    }

    // Loop through the array of fish names and search for the info of that nested object
    for (let i = 0; i < fishNameArr.length; i++) {
        let fishName = fishNameArr[i] // Set fish Name
        let fishObj = allFish[fishName] // Fish object w/ all info
        let availableMonths = fishObj.availability['month-array-northern'] // Set available months of the fish
        let availebleTimes = fishObj.availability['time-array']

        if (fishObj.availability.isAllDay && fishObj.availability.isAllYear) {
            // find the fish that are always catchable first
            catchableFish.push(fishName)
        } else if (
            fishObj.availability.isAllDay &&
            availableMonths.includes(currentMonth)
        ) {
            // Now I want to find the fish that are available allDay during the current month
            catchableFish.push(fishName)
        } else if (
            fishObj.availability.isAllYear &&
            availebleTimes.includes(currentHour)
        ) {
            // Now I want to find the fish that are available allYear during the current time
            catchableFish.push(fishName)
        } else if (
            availableMonths.includes(currentMonth) &&
            availebleTimes.includes(currentHour)
        ) {
            // Now I want to find the fish that are available during the current month AND during the current time
            catchableFish.push(fishName)
        }
    }

    const renderFish = () => {
        return catchableFish.map((fish) => {
            // console.log(allFish[fish].icon_uri)
            return (
                <div>
                    <p>{fish}</p>
                    <img
                        // eslint-disable-next-line react/style-prop-object
                        src={allFish[fish].icon_uri}
                        alt="fish icon"
                    />
                </div>
            )
        })
    }

    return renderFish()
}
export default ShowCatchableFish
