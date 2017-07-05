export class FerryRoute {
    route: TimeRoute = new TimeRoute();
}

export class TimeRoute {
    isOnTime: boolean = true;
    isFull: boolean = false;
    color_isOntime: string = 'dark';
    color_isFull: string = 'dark';
    time_depart: string = '';
    departure_a: string;
    departure_b: string;
    boarding_a: string;
    boarding_b: string;
    priority: string;
    name: string;
}
