/**
 * Jaegers
 * internal-cloudrim9-ElasticL-1JRO34B3OL2U9-676608629.us-east-1.elb.amazonaws.com
 * opsauto-dev.us-west-2.opsautohtc.net
 */

module.exports = function(app, db){

  // Fight a battle!
  app.fight_battle = function(jaeger, kaiju){
    //console.dir( jaeger );

    // Who hits first?
    var jaeger_test = Math.random();
    var kaiju_test = Math.random();

    //console.dir({ jaeger_test: jaeger_test, kaiju_test: kaiju_test });

    if(jaeger_test > kaiju_test){ // Jaeger hits first.
      //console.log( "Jaeger getting first hit" );
      kaiju.hp -= this.jaeger_hit(jaeger, kaiju);

      // Change of a response from kaiju
      if(Math.random() <= 0.75){
        //console.log( "Kaiju responding" );
        jaeger.hp -= this.kiaju_hit(jaeger, kaiju);
      }

    }else{ // Kaiju hits first.
      //console.log( "Kaiju getting first hit" );
      jaeger.hp -= this.kiaju_hit(jaeger, kaiju);

      if(Math.random() <= 0.50){
        //console.log( "Jaeger responding" );
        kaiju.hp -= this.kiaju_hit(jaeger, kaiju);
      }
    }
    //jaeger.hp -= hit;
  }



  // Jaeger
  app.jaeger_hit = function(jaeger, kaiju){
    // This is the base hit
    var hit = (Math.random()*10)

    // Calculate weapon against natual enemy
    if(jaeger.weapons != null && jaeger.weapons.left != null && kaiju.bonuses != null){ 
      var b_hit = {
        ice: (jaeger.weapons.left.ice - kaiju.bonuses.ice),
        fire: (jaeger.weapons.left.fire - kaiju.bonuses.fire),
        earth: (jaeger.weapons.left.earth - kaiju.bonuses.earth),
        water: (jaeger.weapons.left.water - kaiju.bonuses.water)
      }
      //console.dir( b_hit );
      var bonus_hit = (b_hit.ice + b_hit.fire + b_hit.earth, b_hit.water);
      if(bonus_hit > 0){
        //console.log( "Adding bonus hit: %s", bonus_hit );
        hit += bonus_hit;
      }
      //console.log( "-----------" );
    }

    var type = "normal";

    var luck = Math.random();
    if(luck >= 0.90){
      hit += (hit*2)+20;
      type = "lucky";
      //console.log( "%s(%s) got a lucky hit on %s(%s) for %s", jaeger.name, jaeger.hp, kaiju.name, kaiju.hp, hit );

    }else if(luck >= 0.50 && luck < 0.90){
      hit += (hit*0.20);
      type = "good";
      //console.log( "%s(%s) got a good hit on %s(%s) for %s", jaeger.name, jaeger.hp, kaiju.name, kaiju.hp, hit );

    }else{ // You are not lucky.
      //console.log( "%s(%s) hit %s(%s) for %s", jaeger.name, jaeger.hp, kaiju.name, kaiju.hp, hit )

    }

    db.collection( "battle_log" ).insert({
      damage: hit,
      log_type: "jaeger_hit",
      chance_type: type,
      actor_source_id: jaeger._id,
      actor_source_name: jaeger.name,
      actor_target_id: kaiju._id,
      actor_target_name: kaiju.name
    }, {w:0}, function(err, res){
      //console.log( "Battle log created." );
    });

    return hit;
  };



  // Kaiju hit
  app.kiaju_hit = function( jaeger, kaiju ){
    var hit = (Math.random()*10)
    var luck = Math.random();
    var type = "normal";
    if(luck >= 0.90){
      hit += (hit*2);
      type = "lucky"
      //console.log( "%s(%s) got a lucky hit on %s(%s) for %s", kaiju.name, kaiju.hp, jaeger.name, jaeger.hp, hit );

    }else if(luck >= 0.50 && luck < 0.90){
      hit += (hit*0.20);
      type = "good"
      //console.log( "%s(%s) got a good hit on %s(%s) for %s", kaiju.name, kaiju.hp, jaeger.name, jaeger.hp, hit );

    }else{ // You are not lucky.
      //console.log( "%s(%s) hit %s(%s) for %s", kaiju.name, kaiju.hp, jaeger.name, jaeger.hp, hit )

    }

    db.collection( "battle_log" ).insert({
      damage: hit,
      log_type: "kaiju_hit",
      chance_type: type,
      actor_source_id: kaiju._id,
      actor_source_name: kaiju.name,
      actor_target_id: jaeger._id,
      actor_target_name: jaeger.name,
    }, {w:0}, function(err, res){
      //console.log( "Battle log created." );
    });

    return hit;
  };

}
