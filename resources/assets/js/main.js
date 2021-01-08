import $ from 'jquery'
import { TweenLite, CSSPlugin } from 'gsap'
import mobile from './libraries/_mobile.js'
import UI from './libraries/_ui'
import Modal from './elements/_modal'
import Subscribe from './elements/_subscribe'
import Approach from './pages/_approach'
import Contact from './pages/_contact'
import Home from './pages/_home'
import InProgress from './pages/_in-progress'
import Portfolio from './pages/_portfolio'
import Project from './pages/_project'
import Team from './pages/_team'
import Fabric from './pages/_fabrics'

// Prevent tree shaking
/* eslint-disable no-unused-vars */
const plugins = [ CSSPlugin ]
/* eslint-enable no-unused-vars */

class App {
  constructor () {
    window.UI = new UI()
    window.Modal = new Modal()
    window.Subscribe = new Subscribe()

    // Instantiate correct page JS
    if ($('body.home').length) { this.Home = new Home() }
    if ($('#approach').length) { this.Approach = new Approach() }
    if ($('#contact').length) { this.Contact = new Contact() }
    if ($('#in-progress').length) { this.inProgress = new InProgress() }
    if ($('#portfolio').length) { this.portfolio = new Portfolio() }
    if ($('#project').length) { this.project = new Project() }
    if ($('#who').length) { this.team = new Team() }
    if ($('body.single-fabric').length || $('.page-template-template-basket').length) { this.fabric = new Fabric() }
    if ($('body.post-type-archive-fabric').length) { this.fabric = new Fabric() }

    mobile.addClass()
    this.addListeners()
  }

  addListeners () {
    $('#menu-button').on('click', this.toggleMenu)
  }

  toggleMenu () {
    var $menu = $('#menu-container')
    var $menuButton = $('#menu-button')
    var menuSpeed = 0.6
    if ($menu.hasClass('open')) {
      $menu.removeClass('open')
      $menuButton.removeClass('active')
      var dist = $menu.height()
      TweenLite.to($menu, menuSpeed, {y: -dist})
    } else {
      $menu.addClass('open')
      TweenLite.to($menu, menuSpeed, {y: 0})
      $menuButton.addClass('active')
    }
  }
}

$(document).ready(function () {
  (() => new App())()
})
