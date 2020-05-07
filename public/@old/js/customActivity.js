'use strict';

define(function (require) {
    var Postmonger = require('postmonger');
    var connection = new Postmonger.Session();

    var payload = {};
    var authTokens = {};

    var eventDefinitionKey = null;
    var templateCode = null;
    var phoneFieldName = null;
    var parameterList = null;
    var whatsappAccount = null;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedInteraction', requestedInteractionHandler);
    connection.on('clickedNext', save);

    function onRender() {
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestInteraction');

        $('#toggleActive').click(function () {
            document.getElementById('templateCode').disabled = true;
            templateCode = $('#templateCode').val();
            phoneFieldName = $('#phoneFieldName').val();
            parameterList = $('#parameterList').val();
            whatsappAccount = $('#whatsappAccount').val();
            document.getElementById('toggleActive').disabled = true;
            document.getElementById('toggleActive').innerHTML = "Ativado";
        });
    }

    function initialize(data) {
        if (data) {
            payload = data;
        }

        templateCode = payload['arguments'].templateCode;

        if (templateCode) {
            document.getElementById('templateCode').disabled = true;
            document.getElementById('templateCode').value = templateCode;
            
            document.getElementById('phoneFieldName').disabled = true;
            document.getElementById('phoneFieldName').value = templateCode;

            document.getElementById('parameterList').disabled = true;
            document.getElementById('parameterList').value = templateCode;

            document.getElementById('whatsappAccount').disabled = true;
            document.getElementById('whatsappAccount').value = templateCode;

            document.getElementById('toggleActive').disabled = true;
            document.getElementById('toggleActive').innerHTML = "Ativado";
        }
    }

    function onGetTokens(tokens) {
        // console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        // console.log(endpoints);
    }

    function requestedInteractionHandler(settings) {
        try {
            eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
            document.getElementById('select-entryevent-defkey').value = eventDefinitionKey;
        } catch (err) {
            console.error(err);
        }
    }

    function save() {
        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "templateName": templateCode,
            "contactIdentifier": "{{Contact.Key}}",
            "phoneNumber": `{{Event.${eventDefinitionKey}.\"${phoneFieldName}\"}}`,
            "account": whatsappAccount
        }];

        payload['metaData'].isConfigured = true;

        // console.log('payload', JSON.stringify(payload));

        connection.trigger('updateActivity', payload);
    }
});