import { Coordinates } from "../../types/common.types";
import { doRectanglesOverlap } from "../../utils/misc";
import Carrier from "./Carrier";
import Fallable from "./Fallable";

export default class Pickable extends Fallable {
    private picked: boolean = false;
    private carrier: Carrier | null = null;

    public isPicked = () => this.picked;

    public pickUp(carrier: Carrier) {
        this.picked = true;
        this.carrier = carrier;
    }

    public release() {
        this.picked = false;
        this.carrier = null;
    }
    
    public updatePosition(playerCoords: Coordinates) {
        if (!this.element) return;

        if (this.picked && this.carrier) {
            this.coordinates = structuredClone(this.carrier.getCoords());
            this.coordinates.y += this.carrier.getSizes().height / 2 - this.getSizes().height / 2;
        }

        if(!this.picked) this.calculateFalling();

        super.updatePosition(playerCoords);
    }

    public canBePickedBy = (carrier: Carrier) => 
        !this.picked && doRectanglesOverlap(this.coordinates, this.getSizes(), carrier.getCoords(), carrier.getSizes());
}

