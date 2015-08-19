/// <reference path="app.ts"/>
class CompositionView extends Backbone.View {
    template:(data:any) => string;
    model:CompositionInfo;
    input:JQuery;

    constructor(options?) {
        super(options);
        this.events = {
          "click .check":"toggleSwitch"
        };

        this.template = _.template($('#item-template').html());

        _.bindAll(this,'render','close')
    }

    render(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
}