export class Ferrytrips {
    trips: RouteTimetable = new RouteTimetable();
}

export class RouteTimetable {
    id: number;
    
    departure_a: string;
    boarding_a: string;

    departure_b: string;
    boarding_b: string;

    service_date: string;
    is_on_time: boolean = true;
    is_available: boolean = true;
}
