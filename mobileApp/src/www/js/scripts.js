var urlJson = "https://spreadsheets.google.com/feeds/cells/0AqAWn1xLDRvPdDA1Y1liWHI2LUdnS2VhR1V6SHVkUVE/1/public/basic?alt=json";

$(document).ready(function () {

    loadPromotions();

});

function loadPromotions() {
    googleDocsSimpleParser.parseSpreadsheetCellsUrl({
                                                        url: urlJson,
                                                        done: function (people) {
                                                            renderPromotions(people, $("#promotions"));
                                                        },
                                                        transformer: descriptionToUppercase
                                                    });
}

function renderPromotions(promotions, container) {
    container.empty().append($('#promotionTemplate').render({promotions: promotions}));
}

function descriptionToUppercase(promotion) {
    promotion.descripcion = promotion.descripcion.toUpperCase();
    return promotion;
}